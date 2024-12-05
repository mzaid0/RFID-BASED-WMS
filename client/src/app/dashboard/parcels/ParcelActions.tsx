import { deleteParcel, updateParcelStatus } from "@/api/parcel-api";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Importing ShadCN AlertDialog

const ParcelActions = ({
  parcelId,
  currentStatus,
}: {
  parcelId: string;
  currentStatus: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient(); // React Query ka client for query invalidation

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for showing the delete confirmation dialog

  // Update parcel status mutation
  const { mutate: updateStatusMutate, isPending: isUpdating } = useMutation({
    mutationFn: async () => await updateParcelStatus(parcelId),
    onSuccess: (data) => {
      toast({
        title: "Status Updated",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["parcels"] }); // Query key ko explicit specify karna
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete parcel mutation
  const { mutate: deleteParcelMutate, isPending: isDeleting } = useMutation({
    mutationFn: async () => await deleteParcel(parcelId),
    onSuccess: () => {
      toast({
        title: "Parcel Deleted",
        description: "The parcel has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["parcels"] }); // Query key ko explicit specify karna
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteParcelMutate();
    setShowDeleteConfirm(false); // Close dialog after confirming delete
  };

  return (
    <div className="flex items-center gap-4">
      {/* Delete Button - Always Visible */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogTrigger asChild>
          <button
            onClick={() => setShowDeleteConfirm(true)} // Show dialog when clicked
            disabled={isDeleting}
            className="inline-flex items-center justify-center hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this parcel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The parcel will be permanently
              removed from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Status Button - Only show if status is not "Delivered" */}
      {currentStatus !== "Delivered" && (
        <button
          onClick={() => updateStatusMutate()}
          disabled={isUpdating}
          className="inline-flex items-center justify-center hover:text-blue-500 transition-colors"
        >
          {currentStatus === "Pending" ? (
            <ArrowUpDown className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4 hover:text-green-500 transition-colors duration-150" />
          )}
        </button>
      )}

      {/* Loading Indicators */}
      {isUpdating && <span>Updating...</span>}
      {isDeleting && <span>Deleting...</span>}
    </div>
  );
};

export default ParcelActions;
