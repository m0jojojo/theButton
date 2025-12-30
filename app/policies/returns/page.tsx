export const metadata = {
  title: 'Return Policy',
  description: 'Return and exchange policy for The Button',
};

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Return Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Easy Returns</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We want you to be completely satisfied with your purchase. If you&apos;re not happy with 
            your order, you can return it within 7 days of delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Return Conditions</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Items must be unworn, unwashed, and in original condition</li>
            <li>Original tags and packaging must be included</li>
            <li>Items must be returned within 7 days of delivery</li>
            <li>Return shipping costs are the responsibility of the customer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">How to Return</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Contact us on WhatsApp to initiate a return</li>
            <li>We&apos;ll provide you with a return authorization number</li>
            <li>Pack the item securely with original packaging</li>
            <li>Ship it back to our return address</li>
            <li>Once received, we&apos;ll process your refund within 3-5 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Exchanges</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We currently offer exchanges for different sizes. Contact us on WhatsApp to arrange 
            an exchange.
          </p>
        </section>
      </div>
    </div>
  );
}

