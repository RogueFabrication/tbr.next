import { Metadata } from 'next';
/* eslint-disable react/no-unescaped-entities */

export const metadata: Metadata = {
  title: 'Tube Bender Scoring System - How We Rate',
  description: 'Learn how we evaluate and score tube benders. Our comprehensive scoring system considers build quality, precision, ease of use, value, and durability.',
  keywords: 'tube bender scoring, tube bender ratings, how to rate tube benders, tube bender evaluation criteria',
  openGraph: {
    title: 'Tube Bender Scoring System - How We Rate',
    description: 'Learn how we evaluate and score tube benders with our comprehensive rating system.',
  },
};

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Scoring System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how we evaluate tube benders and what our ratings mean. 
              Our comprehensive scoring system helps you understand the quality and value of each product.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Score Tube Benders</h2>
            <p className="text-gray-600 mb-6">
              Our scoring system evaluates tube benders across five key categories, each weighted to reflect 
              their importance in real-world applications. The final score is an average of these categories, 
              providing a comprehensive assessment of each product.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Score Range</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>9.0 - 10.0:</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>8.0 - 8.9:</span>
                    <span className="font-medium text-blue-600">Very Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7.0 - 7.9:</span>
                    <span className="font-medium text-yellow-600">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span>6.0 - 6.9:</span>
                    <span className="font-medium text-orange-600">Fair</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Below 6.0:</span>
                    <span className="font-medium text-red-600">Poor</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scoring Criteria</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Build Quality (20%)</li>
                  <li>• Precision (25%)</li>
                  <li>• Ease of Use (20%)</li>
                  <li>• Value (20%)</li>
                  <li>• Durability (15%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Categories */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Scoring Categories Explained</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Quality (20%)</h3>
                <p className="text-gray-600 mb-4">
                  We evaluate the overall construction quality, materials used, and manufacturing standards. 
                  This includes weld quality, component fit, finish quality, and attention to detail.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What We Look For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Material quality and thickness</li>
                    <li>• Weld consistency and strength</li>
                    <li>• Component precision and fit</li>
                    <li>• Surface finish and corrosion resistance</li>
                    <li>• Overall construction integrity</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Precision (25%)</h3>
                <p className="text-gray-600 mb-4">
                  The most critical factor for professional applications. We test accuracy, repeatability, 
                  and consistency of bends across different materials and sizes.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What We Look For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bend angle accuracy</li>
                    <li>• Radius consistency</li>
                    <li>• Material deformation control</li>
                    <li>• Repeatability across multiple bends</li>
                    <li>• Tolerance adherence</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ease of Use (20%)</h3>
                <p className="text-gray-600 mb-4">
                  How intuitive and user-friendly the machine is to operate, including setup time, 
                  adjustment procedures, and overall workflow efficiency.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What We Look For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Setup and adjustment ease</li>
                    <li>• Control interface design</li>
                    <li>• Safety features and accessibility</li>
                    <li>• Maintenance requirements</li>
                    <li>• Learning curve for new users</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Value (20%)</h3>
                <p className="text-gray-600 mb-4">
                  Cost-effectiveness relative to performance, features, and long-term value. 
                  We consider initial cost, operating costs, and return on investment.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What We Look For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Price-to-performance ratio</li>
                    <li>• Included features and accessories</li>
                    <li>• Operating and maintenance costs</li>
                    <li>• Warranty coverage and support</li>
                    <li>• Long-term reliability and resale value</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Durability (15%)</h3>
                <p className="text-gray-600 mb-4">
                  Long-term reliability and resistance to wear, including stress testing, 
                  component longevity, and real-world usage patterns.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What We Look For:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Component wear resistance</li>
                    <li>• Stress handling capacity</li>
                    <li>• Environmental resistance</li>
                    <li>• Maintenance frequency requirements</li>
                    <li>• Expected service life</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Methodology */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Testing Methodology</h2>
            <p className="text-gray-600 mb-6">
              We conduct comprehensive testing in real-world conditions to ensure our scores accurately 
              reflect actual performance and reliability.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Testing Process</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hands-on testing with multiple materials</li>
                  <li>• Precision measurement and verification</li>
                  <li>• Long-term durability assessment</li>
                  <li>• User experience evaluation</li>
                  <li>• Cost-benefit analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Independent testing and measurements</li>
                  <li>• Manufacturer specifications verification</li>
                  <li>• User feedback and reviews</li>
                  <li>• Industry expert consultations</li>
                  <li>• Real-world usage data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

