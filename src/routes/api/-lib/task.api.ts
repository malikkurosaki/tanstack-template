import Elysia, { t } from "elysia";
import { prisma } from "@/lib/db";
import { ProjectPriority, TaskPriority, TaskStatus, User } from "@/generated/prisma/client";

const TaskApi = new Elysia({
	prefix: "task",
	tags: ["task"],
})
	// Get all tasks dengan pagination dan filters
	.get(
		"/",
		async ({ query }) => {
			const page = query.page || 1;
			const limit = query.limit || 10;
			const skip = (page - 1) * limit;

			const where: any = {
				deletedAt: null,
			};

			if (query.projectId) {
				where.projectId = query.projectId;
			}
			if (query.status) {
				where.status = query.status;
			}
			if (query.priority) {
				where.priority = query.priority;
			}
			if (query.assigneeId) {
				where.assignments = {
					some: {
						userId: query.assigneeId,
					},
				};
			}

			const [data, totalCount] = await Promise.all([
				prisma.task.findMany({
					where,
					take: limit,
					skip: skip,
					include: {
						project: true,
						createdBy: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
						assignments: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
										image: true,
									},
								},
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				}),
				prisma.task.count({ where }),
			]);

			const totalPages = Math.ceil(totalCount / limit);

			return {
				data,
				pagination: {
					page,
					limit,
					total: totalCount,
					totalPages,
				},
			};
		},
		{
			detail: {
				summary: "Get all tasks",
				description: "Mendapatkan list task dengan pagination dan filter",
			},
			query: t.Object({
				page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
				limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10 })),
				projectId: t.Optional(t.String()),
				status: t.Optional(t.String()),
				priority: t.Optional(t.String()),
				assigneeId: t.Optional(t.String()),
			}),
		},
	)

	// Get task by ID
	.get(
		"/:id",
		async ({ params }) => {
			const task = await prisma.task.findUnique({
				where: { id: params.id },
				include: {
					project: true,
					createdBy: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
					assignments: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
					comments: {
						where: { deletedAt: null },
						include: {
							user: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
						},
						orderBy: { createdAt: "desc" },
					},
					attachments: true,
					activities: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									image: true,
								},
							},
						},
						orderBy: { createdAt: "desc" },
					},
					checklists: {
						orderBy: { position: "asc" },
					},
					tags: {
						include: { tag: true },
					},
				},
			});

			if (!task) {
				throw new Error("Task not found");
			}

			return { data: task };
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			detail: {
				summary: "Get task by ID",
				description: "Mendapatkan detail task beserta relasinya",
			},
		},
	)

	// Create new task
	.post(
		"/",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { body } = ctx;

			const task = await prisma.task.create({
				data: {
					title: body.title,
					description: body.description,
					projectId: body.projectId,
					createdById: user.id,
					status: (body.status as TaskStatus) || "TODO",
					priority: (body.priority as ProjectPriority) || "MEDIUM",
					startDate: body.startDate,
					dueDate: body.dueDate,
					estimatedHours: body.estimatedHours,
					parentTaskId: body.parentTaskId,
					position: body.position,
					assignments: body.assigneeIds
						? {
							create: body.assigneeIds.map((userId: string) => ({
								userId,
								assignedById: user.id,
							})),
						}
						: undefined,
				},
				include: {
					project: true,
					createdBy: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});

			// Log activity
			await prisma.taskActivity.create({
				data: {
					taskId: task.id,
					userId: user.id,
					action: "CREATED",
					description: `Task "${task.title}" telah dibuat`,
				},
			});

			return {
				message: "Task created successfully",
				data: task,
			};
		},
		{
			body: t.Object({
				title: t.String(),
				description: t.Optional(t.String()),
				projectId: t.String(),
				status: t.Optional(t.String()),
				priority: t.Optional(t.String()),
				startDate: t.Optional(t.String()),
				dueDate: t.Optional(t.String()),
				estimatedHours: t.Optional(t.Number()),
				parentTaskId: t.Optional(t.String()),
				position: t.Optional(t.Number()),
				assigneeIds: t.Optional(t.Array(t.String())),
			}),
			detail: {
				summary: "Create new task",
				description: "Membuat task baru dalam project",
			},
		},
	)

	// Update task
	.patch(
		"/:id",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { params, body } = ctx;
			const { id } = params;

			const existingTask = await prisma.task.findUnique({
				where: { id },
			});

			if (!existingTask) {
				throw new Error("Task not found");
			}

			const updatedTask = await prisma.task.update({
				where: { id },
				data: {
					title: body.title,
					description: body.description,
					status: body.status as TaskStatus || "TODO",
					priority: body.priority as TaskPriority || "MEDIUM",
					startDate: body.startDate,
					dueDate: body.dueDate,
					estimatedHours: body.estimatedHours,
					actualHours: body.actualHours,
					parentTaskId: body.parentTaskId,
					position: body.position,
				},
				include: {
					project: true,
					createdBy: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});

			// Log status change activity
			if (body.status && body.status !== existingTask.status) {
				await prisma.taskActivity.create({
					data: {
						taskId: id,
						userId: user.id,
						action: "STATUS_CHANGED",
						fieldName: "status",
						oldValue: existingTask.status as string,
						newValue: body.status as string,
						description: `Status berubah dari "${existingTask.status}" menjadi "${body.status}"`,
					},
				});

				await prisma.taskStatusHistory.create({
					data: {
						taskId: id,
						fromStatus: existingTask.status,
						toStatus: body.status as TaskStatus || "TODO",
						changedById: user.id,
					},
				});
			}

			// Log priority change
			if (body.priority && body.priority !== existingTask.priority) {
				await prisma.taskActivity.create({
					data: {
						taskId: id,
						userId: user.id,
						action: "PRIORITY_CHANGED",
						fieldName: "priority",
						oldValue: existingTask.priority as string,
						newValue: body.priority as string,
						description: `Priority berubah dari "${existingTask.priority}" menjadi "${body.priority}"`,
					},
				});
			}

			return {
				message: "Task updated successfully",
				data: updatedTask,
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				title: t.Optional(t.String()),
				description: t.Optional(t.String()),
				status: t.Optional(t.Enum(TaskStatus)),
				priority: t.Optional(t.Enum(TaskPriority)),
				startDate: t.Optional(t.String()),
				dueDate: t.Optional(t.String()),
				estimatedHours: t.Optional(t.Number()),
				actualHours: t.Optional(t.Number()),
				parentTaskId: t.Optional(t.String()),
				position: t.Optional(t.Number()),
			}),
			detail: {
				summary: "Update task",
				description: "Mengupdate data task",
			},
		},
	)

	// Soft delete task
	.delete(
		"/:id",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { params } = ctx;
			const { id } = params;

			const task = await prisma.task.findUnique({
				where: { id },
			});

			if (!task) {
				throw new Error("Task not found");
			}

			await prisma.task.update({
				where: { id },
				data: {
					deletedAt: new Date(),
				},
			});

			await prisma.taskActivity.create({
				data: {
					taskId: id,
					userId: user.id,
					action: "UPDATED",
					description: `Task "${task.title}" telah dihapus`,
				},
			});

			return {
				message: "Task deleted successfully",
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			detail: {
				summary: "Delete task",
				description: "Soft delete task",
			},
		},
	)

	// Add comment to task
	.post(
		"/:id/comments",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { params, body } = ctx;
			const { id } = params;

			const comment = await prisma.taskComment.create({
				data: {
					content: body.content,
					taskId: id,
					userId: user.id,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
			});

			await prisma.taskActivity.create({
				data: {
					taskId: id,
					userId: user.id,
					action: "COMMENTED",
					description: `User menambahkan komentar`,
				},
			});

			return {
				message: "Comment added successfully",
				data: comment,
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				content: t.String(),
			}),
			detail: {
				summary: "Add comment to task",
				description: "Menambahkan komentar pada task",
			},
		},
	)

	// Assign user to task
	.post(
		"/:id/assign",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { params, body } = ctx;
			const { id } = params;

			const assignment = await prisma.taskAssignment.create({
				data: {
					taskId: id,
					userId: body.userId,
					assignedById: user.id,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});

			await prisma.taskActivity.create({
				data: {
					taskId: id,
					userId: user.id,
					action: "ASSIGNED",
					description: `User "${assignment.user.name}" ditugaskan ke task ini`,
				},
			});

			return {
				message: "User assigned successfully",
				data: assignment,
			};
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				userId: t.String(),
			}),
			detail: {
				summary: "Assign user to task",
				description: "Menugaskan user ke task",
			},
		},
	)

	// Unassign user from task
	.delete(
		"/:id/assign/:userId",
		async (ctx) => {
			const { user }: { user: User } = ctx as any;
			const { params } = ctx;
			const { id, userId } = params;

			await prisma.taskAssignment.delete({
				where: {
					taskId_userId: {
						taskId: id,
						userId: userId,
					},
				},
			});

			await prisma.taskActivity.create({
				data: {
					taskId: id,
					userId: user.id,
					action: "UNASSIGNED",
					description: `User dilepas dari task ini`,
				},
			});

			return {
				message: "User unassigned successfully",
			};
		},
		{
			params: t.Object({
				id: t.String(),
				userId: t.String(),
			}),
			detail: {
				summary: "Unassign user from task",
				description: "Melepas user dari task",
			},
		},
	);

export { TaskApi };
