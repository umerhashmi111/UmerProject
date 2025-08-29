"use client";

export default function Footer() {
  return (
    <footer className="bg-[#EBEFF3] border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-700 grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-semibold">Email</p>
          <p>info@wpcalrecovery.com</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p>(888) 000-4770</p>
        </div>
        <div>
          <p className="font-semibold">Business Hours</p>
          <p>6:00 AM – 6:00 PM Eastern</p>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} Westpoint Capital & Recovery, Inc. | Privacy Policy | Terms | Cookies
      </div>
    </footer>
  );
}
