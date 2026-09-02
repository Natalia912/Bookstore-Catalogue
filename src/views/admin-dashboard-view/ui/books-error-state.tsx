import { AlertCircle } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/src/shared/components";

export function BooksErrorState({ error }: { error: string }) {
    return (
        <Empty className="min-h-72">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <AlertCircle className="size-5" />
                </EmptyMedia>
                <EmptyTitle>Something went wrong</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
                <EmptyDescription>{error}</EmptyDescription>
            </EmptyContent>
        </Empty>
    );
}