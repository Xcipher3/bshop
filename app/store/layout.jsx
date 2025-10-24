import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Bijema - Store Dashboard",
    description: "Bijema - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}