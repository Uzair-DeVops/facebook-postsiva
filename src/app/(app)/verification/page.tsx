"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadPaymentScreenshot } from "@/lib/hooks/tier/api";

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = parseInt(searchParams.get("order_id") || "0");
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a screenshot to upload");
      return;
    }

    if (!orderId || orderId === 0) {
      setError("Invalid order ID. Please go back and try again.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadPaymentScreenshot(orderId, selectedFile);
      
      if (response.success) {
        setUploadSuccess(true);
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      } else {
        setError("Failed to upload screenshot. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload screenshot";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (document.getElementById('screenshot-upload')) {
      (document.getElementById('screenshot-upload') as HTMLInputElement).value = '';
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="glow-effect top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center max-w-md w-full border border-slate-100 z-10"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Screenshot Uploaded!</h2>
          <p className="text-slate-600 text-lg leading-relaxed font-bold mb-2">
            Your payment screenshot has been uploaded successfully.
          </p>
          <p className="text-slate-500 text-sm font-medium mb-8">
            Your plan will be activated within <span className="text-primary font-bold">24 hours</span> after admin verification.
            Please <span className="text-primary font-bold">check your email</span> for the confirmation receipt and activation status.
          </p>
          
          <Button 
            onClick={() => router.push("/profile")}
            className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Go to Profile
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="glow-effect top-0 left-0 w-[800px] h-[800px] opacity-20" />
      <div className="glow-effect bottom-0 right-0 w-[600px] h-[600px] opacity-20" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-bold group uppercase text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Checkout
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="p-8 md:p-10 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Upload Payment Screenshot</h1>
            <p className="text-slate-500 font-medium">Upload a screenshot of your payment receipt for verification</p>
          </div>

          <div className="p-8 md:p-10 space-y-8">
            {/* Notice */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-800 leading-relaxed mb-2">
                  <span className="font-black">Important:</span> Please upload a clear screenshot of your payment receipt or transaction confirmation.
                </p>
                <p className="text-xs font-medium text-blue-700">
                  The screenshot should clearly show the transaction ID, amount, and payment method.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Upload Area */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Payment Screenshot *
              </label>
              <div 
                onClick={() => !previewImage && document.getElementById('screenshot-upload')?.click()}
                className={cn(
                  "h-64 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group",
                  previewImage ? "border-primary" : "border-slate-200 hover:border-primary/30"
                )}
              >
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={previewImage} 
                      alt="Screenshot Preview" 
                      fill 
                      className="object-contain p-4" 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        PNG, JPG, or JPEG (Max 10MB)
                      </p>
                    </div>
                  </>
                )}
                <input 
                  id="screenshot-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-tight">Upload Guidelines</h3>
              <ul className="space-y-2">
                {[
                  "Ensure the screenshot is clear and readable",
                  "The transaction ID should be visible",
                  "The payment amount should match your order",
                  "The payment method should be clearly shown",
                  "Avoid blurry or cropped images"
                ].map((guideline, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-3"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Screenshot
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest"
              >
                Skip for Now
              </Button>
            </div>
            
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              You can upload the screenshot later from your orders page
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}
