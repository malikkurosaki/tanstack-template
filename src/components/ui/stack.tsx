import type * as React from "react";

import { cn } from "@/lib/utils";

function Stack({
	gap = 2,
	className,
	...props
}: React.ComponentProps<"div"> & { gap?: number }) {
	return (
		<div
			className={cn(`flex flex-col gap-${gap} *:w-fit`, className)}
			{...props}
		/>
	);
}

export { Stack };
