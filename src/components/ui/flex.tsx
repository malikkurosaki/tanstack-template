import type * as React from "react";
import { cn } from "@/lib/utils";

type Justify = "start" | "center" | "end" | "between";

const justifyClass: Record<Justify, string> = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
};

function Flex({
	className,
	justify = "start",
	...props
}: React.ComponentProps<"div"> & { justify?: Justify }) {
	return (
		<div
			className={cn(
				"flex w-full flex-nowrap gap-2",
				justifyClass[justify],
				className,
			)}
			{...props}
		/>
	);
}

export { Flex };
