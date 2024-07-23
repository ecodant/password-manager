import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"


// import { CategoriesSelector } from "./CategoriesSelector"
// import { Checkbox } from "./ui/checkbox"
import { Item } from "@/lib/types"


import { ItemForm } from "./forms/ItemForm"
interface ItemDialogProps {
    onItemSave: (item: Item) => void,
    itemToEdit?: Item,
    onClose: () => void,
    isOpen: boolean
}

export function ItemDialog({ onItemSave, itemToEdit, onClose, isOpen }: ItemDialogProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal defaultOpen={isOpen}>

            <DialogContent className="sm:max-w-[425px]" >
                <DialogHeader>
                    {itemToEdit ?
                        <DialogTitle>Save Changes</DialogTitle>
                        :
                        <DialogTitle>Add New Item</DialogTitle>
                    }

                    <DialogDescription>
                        Save your news passwords in the following:
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <ItemForm onItemSave={onItemSave} onClose={onClose} itemToEdit={itemToEdit} />

                </div>
                {/* 
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>Save changes</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
