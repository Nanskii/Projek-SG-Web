export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function generateDocumentNumber(prefix: string): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `DOC/${prefix}/${month}/${year}/${rand}`;
}

export function getStarRating(rating: number): string[] {
  const stars: string[] = [];
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) stars.push("full");
  if (hasHalf) stars.push("half");
  while (stars.length < 5) stars.push("empty");
  return stars;
}

export function getFallbackImage(id: string, categoryName: string): string {
  const cat = (categoryName || "").toLowerCase();

  // 5 Foto Statis Berkualitas Tinggi (Unsplash)
  const images = {
    sembako: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
    atk: "https://plus.unsplash.com/premium_photo-1683120746952-651521089299?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fashion: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400",
    rumah: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400",
    bangunan: "https://plus.unsplash.com/premium_photo-1681989490797-dbe51c438b61?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    default: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=400", // ATK / Umum / Box
  };

  if (cat.includes("sembako")) return images.sembako;
  if (cat.includes("elektronik")) return images.default;
  if (cat.includes("fashion") || cat.includes("pakaian")) return images.fashion;
  if (cat.includes("atk") || cat.includes("tulis")) return images.atk;
  if (cat.includes("rumah")) return images.rumah;
  if (cat.includes("bangunan") || cat.includes("material")) return images.bangunan;

  return images.default;
}
