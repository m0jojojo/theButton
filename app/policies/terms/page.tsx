export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for The Button',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <p className="text-gray-700 mb-4 leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            By accessing and using The Button website, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Products and Pricing</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We reserve the right to change product prices at any time. All prices are in Indian Rupees (INR). 
            We strive to ensure accuracy in product descriptions and images, but errors may occur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Orders and Payment</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            When you place an order, you are making an offer to purchase products. We reserve the right 
            to accept or reject any order. Payment must be received before we ship your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The Button shall not be liable for any indirect, incidental, special, or consequential 
            damages arising from your use of our website or products.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            If you have questions about these terms, please contact us on WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}

