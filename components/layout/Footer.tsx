import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">PURITY</h3>
            <p className="text-sm text-neutral-600 max-w-xs">
              Premium minimalist styling services and atelier. Elevating your personal style with curated fashion.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/services/styling" className="hover:text-neutral-900">Personal Styling</Link></li>
              <li><Link href="/services/wardrobe" className="hover:text-neutral-900">Wardrobe Audit</Link></li>
              <li><Link href="/services/shopping" className="hover:text-neutral-900">Personal Shopping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/about" className="hover:text-neutral-900">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-neutral-900">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-neutral-900">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><a href="#" className="hover:text-neutral-900">Instagram</a></li>
              <li><a href="#" className="hover:text-neutral-900">Facebook</a></li>
              <li><a href="#" className="hover:text-neutral-900">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} PURITY Fashion Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
