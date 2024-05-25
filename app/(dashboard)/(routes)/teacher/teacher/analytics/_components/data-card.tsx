import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
    data: number;
    label: string;
    shouldFormat?: boolean;

}

export const DataCard = ({
    data, label, shouldFormat
} : DataCardProps ) =>{
    return(
        <Card>
            <CardHeader className="flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {shouldFormat ? formatPrice(data) : data}
                </div>
            </CardContent>
        </Card>
    )
}