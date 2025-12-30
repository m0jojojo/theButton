export const metadata = {
  title: 'Shipping Policy',
  description: 'Shipping information and delivery details for The Button',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Shipping Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Delivery Information</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We offer fast and reliable shipping across India. All orders are processed and shipped 
            within 1-2 business days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Shipping Rates</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Free shipping on orders above ₹2,000</li>
            <li>Standard shipping: ₹99 (3-5 business days)</li>
            <li>Express shipping: ₹199 (1-2 business days)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Delivery Time</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Delivery times may vary based on your location. We&apos;ll send you a tracking number once 
            your order ships so you can track it in real-time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Questions?</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            If you have any questions about shipping, please contact us on WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}

