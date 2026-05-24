import Link from "next/link";

type OrganizationCardProps = {
  org: {
    id?: string;
    name: string;
    slug?: string;
    description?: string;
  };
};

export default function OrganizationCard({ org }: OrganizationCardProps) {
  return (
    <div className="border rounded-lg p-5 shadow hover:shadow-lg">
      <h2 className="text-lg font-bold">
        {org.name}
      </h2>

      <p className="text-gray-600 mt-2 text-sm">
        {org.description || "No description available."}
      </p>

      <Link href={`/organizations/${org.slug || org.id}`}>
        <button
          type="button"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          View Club
        </button>
      </Link>
    </div>
  );
}