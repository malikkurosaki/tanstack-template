import type * as React from "react";
import { cn } from "@/lib/utils";

type Justify = "start" | "center" | "end";

const justifyClass: Record<Justify, string> = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
};

function Group({
	className,
	justify = "start",
	...props
}: React.ComponentProps<"div"> & { justify?: Justify }) {
	return (
		<div
			className={cn(
				"flex flex-wrap gap-2 *:w-fit",
				justifyClass[justify],
				className,
			)}
			{...props}
		/>
	);
}

export { Group };
