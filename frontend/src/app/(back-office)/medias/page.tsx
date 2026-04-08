import MediaLibrary from "@/components/Dashboard/MediaLibrary";
import { ProtectedRoute } from "@/components/Dashboard/ProtectedRoute";
// ou dans une page :
export default function Page() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <MediaLibrary />
        </ProtectedRoute>
    );
}