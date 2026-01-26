"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Upload, 
  AlertCircle,
  HelpCircle,
  Package,
  Wallet,
  Loader2,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planName = searchParams.get("name") || "Small Plan";
  const planPrice = searchParams.get("price") || "500";
  
  const [method, setFilter] = useState("JazzCash");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewUrls] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewUrls(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="glow-effect top-0 left-0 w-[800px] h-[800px] opacity-20" />
      <div className="glow-effect bottom-0 right-0 w-[600px] h-[600px] opacity-20" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/#pricing" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-bold group uppercase text-xs tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Packages
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="p-8 md:p-10 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Complete Your Payment</h1>
            <p className="text-slate-500 font-medium">Choose your preferred payment method below</p>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {/* Selected Package */}
            <div className="bg-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Selected Package</p>
                    <h3 className="text-2xl font-black">{planName}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black italic">Rs{planPrice}</span>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 blur-[60px] rounded-full" />
            </div>

            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-black uppercase text-xs tracking-[0.2em]">
                <Wallet className="w-4 h-4 text-primary" />
                Available Payment Methods
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "JazzCash", name: "JazzCash", sub: "0323-6891550", icon: Phone },
                  { id: "EasyPaisa", name: "EasyPaisa", sub: "0323-6891550", icon: Phone },
                  { id: "HBL", name: "HBL Bank", sub: "50627918024003", icon: Building2 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all duration-300 text-center group relative overflow-hidden",
                      method === item.id 
                        ? "bg-primary/5 border-primary shadow-lg shadow-primary/10" 
                        : "bg-white border-slate-100 hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
                      method === item.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className={cn("font-black text-sm", method === item.id ? "text-slate-900" : "text-slate-500")}>{item.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{item.sub}</p>
                    {method === item.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-800 leading-relaxed">
                <span className="font-black">Note:</span> After making payment, please submit the transaction details below for verification.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <div className="flex items-center gap-2 mb-6 font-black text-slate-900 text-xs tracking-widest uppercase">
                <HelpCircle className="w-4 h-4 text-primary" />
                Payment Instructions
              </div>
              <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                  Account Title
                </p>
                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  Please send your payment to: <br /> <span className="font-extrabold animate-pulse text-primary">Muhammad Uzair</span>
                </p>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  This is the registered account name for <span className="font-semibold">JazzCash</span>, <span className="font-semibold">EasyPaisa</span>, and <span className="font-semibold">HBL Bank</span>. Ensure the name matches during your transfer.
                </p>
              </div>
              <ol className="space-y-4">
                {[
                  `Choose your preferred payment method (${method})`,
                  `Send Rs${planPrice} to the account listed above`,
                  "Keep your transaction ID / receipt",
                  "Fill in the form below with transaction details",
                  "Our team will verify and activate your subscription within 24 hours"
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm font-bold text-slate-600">
                    <span className="flex-none w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-primary">{i + 1}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-8 pt-4">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Submit Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method *</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center justify-between text-sm font-bold text-slate-900 outline-none focus:border-primary transition-all cursor-pointer hover:bg-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            {method === "HBL" ? <Building2 className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                          </div>
                          {method === "HBL" ? "HBL Bank" : method}
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setIsDropdownOpen(false)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-20 p-2"
                            >
                              {[
                                { id: "JazzCash", name: "JazzCash", icon: Phone },
                                { id: "EasyPaisa", name: "EasyPaisa", icon: Phone },
                                { id: "HBL", name: "HBL Bank", icon: Building2 },
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setFilter(item.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all",
                                    method === item.id 
                                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                      : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                    method === item.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                                  )}>
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-bold text-sm">{item.name}</span>
                                  {method === item.id && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto fill-white text-primary" />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction ID / Ref Number *</label>
                    <Input required placeholder="e.g., TXN123456789" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Phone Number *</label>
                    <Input required placeholder="e.g., 03XX-XXXXXXX" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date *</label>
                    <div className="relative">
                      <Input required type="date" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold pl-4" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Receipt (Optional)</label>
                  <div 
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                    className="h-48 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 hover:border-primary/30 transition-all overflow-hidden relative group"
                  >
                    {previewImage ? (
                      <Image src={previewImage} alt="Receipt Preview" fill className="object-fill" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Click to upload screenshot</p>
                      </>
                    )}
                    <input id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes (Optional)</label>
                  <textarea placeholder="Any additional information..." className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-primary transition-all resize-none" />
                </div>
              </div>

              <Button 
                disabled={isSubmitting}
                className="w-full h-16 bg-primary hover:bg-primary/90 rounded-3xl font-black text-base uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98] gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Payment Details
                  </>
                )}
              </Button>
              
              <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Need help? Contact us at <span className="text-primary underline">support@postsiva.com</span>
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center max-w-md w-full border border-slate-100"
            >
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Request Sent!</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-bold mb-2">
                Your plan will be activated within <span className="text-primary">24 hours</span>.
              </p>
              <p className="text-slate-500 text-sm font-medium mb-8">
                Please <span className="text-primary font-bold">check your email</span> for the confirmation receipt and activation status.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push("/profile")}
                  className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Go to Profile
                </Button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Stay on this page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white relative">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
