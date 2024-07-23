

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
//category: z.enum(["Work", "Personal", "Social", "Banking", "Other", "No category"]).default("No category"),
export function CategoriesSelector() {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
