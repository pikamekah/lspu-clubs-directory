"use client";

import Modal from "../Modal";
import ModalField from "../ModalField";
import ModalActions from "../ModalActions";
import type { OrgForm } from "../../types";

type Props = {
  show: boolean;
  orgForm: OrgForm;
  setOrgForm: React.Dispatch<React.SetStateAction<OrgForm>>;
  departmentOptions: string[];
  setShowOrgModal: (show: boolean) => void;
  createOrganization: () => void;
};

export default function CreateOrganizationModal({
  show,
  orgForm,
  setOrgForm,
  departmentOptions,
  setShowOrgModal,
  createOrganization,
}: Props) {
  if (!show) return null;

  return (
    <Modal onClose={() => setShowOrgModal(false)}>
      <div className="mb-6 sm:mb-7">
        <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
          Organization
        </p>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
          Create Organization
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Add a new accredited organization to UniLink.
        </p>
      </div>

      <div className="space-y-4">
        <ModalField
          label="Organization Name"
          placeholder="Enter organization name"
          value={orgForm.name}
          onChange={(value: string) =>
            setOrgForm({
              ...orgForm,
              name: value,
            })
          }
        />

        <ModalField
          label="Short Description"
          placeholder="Enter short description"
          value={orgForm.short_desc}
          onChange={(value: string) =>
            setOrgForm({
              ...orgForm,
              short_desc: value,
            })
          }
        />

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
            Department
          </span>

          <select
            title="Select Department"
            aria-label="Select Department"
            value={orgForm.department}
            onChange={(e) =>
              setOrgForm({
                ...orgForm,
                department: e.target.value,
              })
            }
            className="w-full h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
          >
            <option value="">Select Department</option>

            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <ModalField
          label="President"
          placeholder="President"
          value={orgForm.president}
          onChange={(value: string) =>
            setOrgForm({
              ...orgForm,
              president: value,
            })
          }
        />

        <ModalField
          label="Contact"
          placeholder="Contact"
          value={orgForm.contact}
          onChange={(value: string) =>
            setOrgForm({
              ...orgForm,
              contact: value,
            })
          }
        />
      </div>

      <ModalActions
        onCancel={() => setShowOrgModal(false)}
        onSave={createOrganization}
      />
    </Modal>
  );
}