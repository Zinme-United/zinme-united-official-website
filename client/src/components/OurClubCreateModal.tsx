import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OurClubSchema, type OurClubInput } from "../schemas/ourClubSchemas";
import { uploadOurClubHeroImage } from "../hooks/useOurClub";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: OurClubInput | undefined | null;
  onSubmit: (data: OurClubInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

const AboutFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OurClubInput>({
    resolver: zodResolver(OurClubSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      mission: "",
      vision: "",
      foundedYear: "",
      stats: [],
      milestones: [],
      values: [],
      heroImageUrl: "",
      heroPublicId: "",
      ctaText: "",
      ctaLink: "",
    },
    values: defaultValues || undefined,
  });

  const heroImageUrl = watch("heroImageUrl");
  const [uploading, setUploading] = useState(false);

  const {
    fields: statFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({ control, name: "stats" });

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone,
  } = useFieldArray({ control, name: "milestones" });

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({ control, name: "values" });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || undefined);
    }
  }, [isOpen, defaultValues, reset]);

  const onFormSubmit = async (data: OurClubInput) => {
    await onSubmit(data);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const result = await uploadOurClubHeroImage(e.target.files[0]);
      setValue("heroImageUrl", result.imageUrl);
      setValue("heroPublicId", result.publicId);
    } catch (e: any) {
      toast.error(e.message);
      // swallow; toast in parent if desired
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            {defaultValues ? "Edit About" : "Create About"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Hero Image
              </label>

              {heroImageUrl ? (
                <div className="relative w-full h-48 mb-2">
                  <img
                    src={heroImageUrl}
                    alt="Hero"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("heroImageUrl", "");
                      setValue("heroPublicId", "");
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="hero-upload"
                  className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-500 hover:border-primary hover:text-primary transition"
                >
                  <ImageIcon className="mb-2" />
                  <span>
                    {uploading ? "Uploading..." : "Click to upload Hero Image"}
                  </span>
                  <input
                    id="hero-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            {/* Basic fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Subtitle
                </label>
                <input
                  {...register("subtitle")}
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md text-primary"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Mission
                </label>
                <textarea
                  {...register("mission")}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Vision
                </label>
                <textarea
                  {...register("vision")}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Founded Year
                </label>
                <input
                  {...register("foundedYear")}
                  placeholder="2024"
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
              </div>
            </div>

            {/* Stats */}
            <div>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-primary">Stats</label>
                <button
                  type="button"
                  onClick={() => appendStat({ label: "", value: "" })}
                  className="flex items-center gap-1 text-primary"
                >
                  <Plus size={16} /> Add Stat
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {statFields.map((field, i) => (
                  <div key={field.id} className="grid md:grid-cols-3 gap-2">
                    <input
                      {...register(`stats.${i}.label`)}
                      placeholder="Label"
                      className="border rounded p-2 text-primary"
                    />
                    <input
                      {...register(`stats.${i}.value`)}
                      placeholder="Value"
                      className="border rounded p-2 text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(i)}
                      className="inline-flex items-center justify-center rounded bg-red-50 text-red-600 px-3"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-primary">
                  Milestones
                </label>
                <button
                  type="button"
                  onClick={() =>
                    appendMilestone({ year: "", title: "", desc: "" })
                  }
                  className="flex items-center gap-1 text-primary"
                >
                  <Plus size={16} /> Add Milestone
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {milestoneFields.map((field, i) => (
                  <div key={field.id} className="grid md:grid-cols-4 gap-2">
                    <input
                      {...register(`milestones.${i}.year`)}
                      placeholder="Year (e.g. 2024–2025)"
                      className="border rounded p-2 text-primary"
                    />
                    <input
                      {...register(`milestones.${i}.title`)}
                      placeholder="Title"
                      className="border rounded p-2 text-primary"
                    />
                    <input
                      {...register(`milestones.${i}.desc`)}
                      placeholder="Description"
                      className="border rounded p-2 md:col-span-2 text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      className="inline-flex items-center justify-center rounded bg-red-50 text-red-600 px-3 md:col-span-4"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-primary">Values</label>
                <button
                  type="button"
                  onClick={() => appendValue({ title: "", desc: "", icon: "" })}
                  className="flex items-center gap-1 text-primary"
                >
                  <Plus size={16} /> Add Value
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {valueFields.map((field, i) => (
                  <div key={field.id} className="grid md:grid-cols-3 gap-2">
                    <input
                      {...register(`values.${i}.title`)}
                      placeholder="Title"
                      className="border rounded p-2 text-primary"
                    />
                    <input
                      {...register(`values.${i}.desc`)}
                      placeholder="Description"
                      className="border rounded p-2 text-primary"
                    />
                    <input
                      {...register(`values.${i}.icon`)}
                      placeholder="Icon (optional, e.g. HeartHandshake)"
                      className="border rounded p-2 text-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeValue(i)}
                      className="inline-flex items-center justify-center rounded bg-red-50 text-red-600 px-3 md:col-span-3"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  CTA Text
                </label>
                <input
                  {...register("ctaText")}
                  placeholder="Support or Sponsor Us"
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  CTA Link
                </label>
                <input
                  {...register("ctaLink")}
                  placeholder="https://example.com/contact"
                  className="w-full p-3 border border-gray-300 rounded-md text-primary"
                />
                {errors.ctaLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ctaLink.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-primary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer inline-flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutFormModal;
