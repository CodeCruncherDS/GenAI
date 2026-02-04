"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

type Props = {
    url: string;
};

export default function SpecPanel({ url }: Props) {
    if (!url) return <div className="p-4 text-sm text-neutral-500">No spec selected</div>;

    return (
        <div className="h-full overflow-auto bg-white">
            <SwaggerUI url={url} />
        </div>
    );
}
