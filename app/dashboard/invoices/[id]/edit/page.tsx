import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import { notFound } from "next/navigation";
import React from "react";

const EditInvoiceFormPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;
  const [invoice, customers] = await Promise.all([
    await fetchInvoiceById(params.id),
    await fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm customers={customers} invoice={invoice} />
    </main>
  );
};

export default EditInvoiceFormPage;
