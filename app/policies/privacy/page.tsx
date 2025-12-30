export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for The Button',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <p className="text-gray-700 mb-4 leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Name and contact information</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Order history and preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our services and customer experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We take data security seriously and implement appropriate measures to protect your 
            personal information. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            If you have questions about this privacy policy, please contact us on WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}

