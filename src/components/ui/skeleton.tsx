import type * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div"> & {
	h?: number;
};

function Skeleton({ h = 40, className, ...props }: SkeletonProps) {
	return (
		<div
			style={{ height: h }}
			className={cn(
				"w-full animate-pulse rounded-md bg-muted",
				className
			)}
			{...props}
		/>
	);
}

export { Skeleton };
