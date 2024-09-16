"use client";
import React, { useRef, useState } from "react";
import { User } from "@auth/core/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import Resizer from "react-image-file-resizer";
import "cropperjs/dist/cropper.css";
import { Cropper, ReactCropperElement } from "react-cropper";
import { useProfile } from "./useProfile";

const ToggleEditProfile = ({ user }: { user: User }) => {
  const {
    bio,
    displayName,
    handleChange,
    profileImage,
    setProfileImage,
    handleSubmit,
  } = useProfile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <ProfileImage
              image={profileImage}
              onImageChange={setProfileImage}
            />
            <Input
              id="displayName"
              placeholder="Display name"
              value={displayName}
              onChange={handleChange("displayName")}
              className="col-span-3"
            />
          </div>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChange={handleChange("bio")}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProfileImage = ({
  image,
  onImageChange,
}: {
  image?: string;
  onImageChange: (image?: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-24 h-24 rounded-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {image ? (
        <Image src={image} alt="Profile" layout="fill" objectFit="cover" />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <Camera size={32} className="text-gray-400" />
        </div>
      )}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <ButtonCamera
            onImageCropped={(blob) =>
              onImageChange(blob ? URL.createObjectURL(blob) : undefined)
            }
            aspectRatio={1}
          />
          {image && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full"
              onClick={() => onImageChange(undefined)}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const ButtonCamera = ({
  onImageCropped,
  aspectRatio,
}: {
  onImageCropped: (blob: Blob | null) => void;
  aspectRatio: number;
}) => {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file"
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only"
      />
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera size={20} />
      </Button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={aspectRatio}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
};

const CropImageDialog = ({
  src,
  cropAspectRatio,
  onCropped,
  onClose,
}: {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const crop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Cropper
            src={src}
            aspectRatio={cropAspectRatio}
            guides={false}
            ref={cropperRef}
            className="max-h-[300px]"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleEditProfile;
