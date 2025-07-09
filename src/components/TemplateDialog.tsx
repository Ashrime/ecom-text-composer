
import React, { useState } from 'react';
import { X, ShoppingBag, Package, Star, Award, Truck, Shield } from 'lucide-react';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (templateContent: string) => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = [
    {
      id: 'product-features',
      name: 'Product Features',
      icon: Package,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">🌟 Key Features</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; padding: 10px; background: #F3F4F6; border-radius: 8px;">
              <strong>✅ Premium Quality:</strong> Made with high-quality materials for lasting durability
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #F3F4F6; border-radius: 8px;">
              <strong>🚀 Fast Performance:</strong> Optimized for speed and efficiency in daily use
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #F3F4F6; border-radius: 8px;">
              <strong>🎨 Elegant Design:</strong> Sleek and modern aesthetic that fits any environment
            </li>
            <li style="margin: 10px 0; padding: 10px; background: #F3F4F6; border-radius: 8px;">
              <strong>🔧 Easy Setup:</strong> Quick and hassle-free installation process
            </li>
          </ul>
        </div>
      `
    },
    {
      id: 'specifications',
      name: 'Product Specifications',
      icon: Award,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">📋 Specifications</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="border: 1px solid #E5E7EB; padding: 12px; background: #F9FAFB; font-weight: bold;">Dimensions</td>
              <td style="border: 1px solid #E5E7EB; padding: 12px;">15" x 12" x 8"</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E5E7EB; padding: 12px; background: #F9FAFB; font-weight: bold;">Weight</td>
              <td style="border: 1px solid #E5E7EB; padding: 12px;">2.5 lbs</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E5E7EB; padding: 12px; background: #F9FAFB; font-weight: bold;">Material</td>
              <td style="border: 1px solid #E5E7EB; padding: 12px;">Premium aluminum alloy</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E5E7EB; padding: 12px; background: #F9FAFB; font-weight: bold;">Color Options</td>
              <td style="border: 1px solid #E5E7EB; padding: 12px;">Black, Silver, Rose Gold</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E5E7EB; padding: 12px; background: #F9FAFB; font-weight: bold;">Warranty</td>
              <td style="border: 1px solid #E5E7EB; padding: 12px;">2 years limited warranty</td>
            </tr>
          </table>
        </div>
      `
    },
    {
      id: 'shipping-returns',
      name: 'Shipping & Returns',
      icon: Truck,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">🚚 Shipping & Returns</h3>
          
          <div style="background: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #1E40AF; margin: 0 0 10px 0;">📦 Shipping Information</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Free shipping on orders over $50</li>
              <li>Standard delivery: 3-5 business days</li>
              <li>Express shipping available (1-2 days)</li>
              <li>International shipping to most countries</li>
            </ul>
          </div>

          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">🔄 Return Policy</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>30-day return window</li>
              <li>Free returns on defective items</li>
              <li>Items must be in original condition</li>
              <li>Refund processed within 5-7 business days</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      id: 'customer-reviews',
      name: 'Customer Reviews',
      icon: Star,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">⭐ Customer Reviews</h3>
          
          <div style="background: #FFFBEB; border: 1px solid #FED7AA; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="color: #F59E0B; font-size: 18px;">⭐⭐⭐⭐⭐</span>
              <strong style="margin-left: 10px;">Sarah M.</strong>
            </div>
            <p style="margin: 0; font-style: italic;">"Absolutely love this product! The quality is outstanding and it arrived faster than expected. Highly recommend!"</p>
          </div>

          <div style="background: #FFFBEB; border: 1px solid #FED7AA; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="color: #F59E0B; font-size: 18px;">⭐⭐⭐⭐⭐</span>
              <strong style="margin-left: 10px;">John D.</strong>
            </div>
            <p style="margin: 0; font-style: italic;">"Great value for money. The design is sleek and it works perfectly. Customer service was also very helpful."</p>
          </div>

          <div style="background: #FFFBEB; border: 1px solid #FED7AA; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="color: #F59E0B; font-size: 18px;">⭐⭐⭐⭐⭐</span>
              <strong style="margin-left: 10px;">Emily R.</strong>
            </div>
            <p style="margin: 0; font-style: italic;">"Exceeded my expectations! The quality is amazing and it's exactly what I was looking for. Will definitely buy again."</p>
          </div>
        </div>
      `
    },
    {
      id: 'warranty-support',
      name: 'Warranty & Support',
      icon: Shield,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">🛡️ Warranty & Support</h3>
          
          <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #0C4A6E; margin: 0 0 10px 0;">🔒 Warranty Coverage</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li><strong>2-Year Limited Warranty</strong> on manufacturing defects</li>
              <li>Coverage includes parts and labor</li>
              <li>Warranty valid from purchase date</li>
              <li>Register your product for extended benefits</li>
            </ul>
          </div>

          <div style="background: #F5F3FF; border: 1px solid #D8B4FE; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #6B21A8; margin: 0 0 10px 0;">📞 Customer Support</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>24/7 customer support hotline</li>
              <li>Live chat available on our website</li>
              <li>Comprehensive FAQ and troubleshooting guides</li>
              <li>Video tutorials and setup guides</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 20px 0; padding: 15px; background: #F8FAFC; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #374151;">Need Help? Contact Us:</p>
            <p style="margin: 5px 0; color: #6B7280;">📧 support@company.com | 📞 1-800-SUPPORT</p>
          </div>
        </div>
      `
    },
    {
      id: 'product-comparison',
      name: 'Product Comparison',
      icon: ShoppingBag,
      content: `
        <div style="margin: 20px 0;">
          <h3 style="color: #1F2937; font-size: 1.5em; margin-bottom: 15px;">⚖️ Product Comparison</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #F3F4F6;">
                <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: left;">Feature</th>
                <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Basic</th>
                <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: center; background: #EFF6FF;">Pro ⭐</th>
                <th style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 12px; font-weight: bold;">Price</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">$99</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center; background: #EFF6FF;">$149</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">$199</td>
              </tr>
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 12px; font-weight: bold;">Warranty</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">1 Year</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center; background: #EFF6FF;">2 Years</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">3 Years</td>
              </tr>
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 12px; font-weight: bold;">Features</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Standard</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center; background: #EFF6FF;">Advanced</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Premium</td>
              </tr>
              <tr>
                <td style="border: 1px solid #E5E7EB; padding: 12px; font-weight: bold;">Support</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Email</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center; background: #EFF6FF;">24/7 Chat</td>
                <td style="border: 1px solid #E5E7EB; padding: 12px; text-align: center;">Priority</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onInsert(template.content);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">E-commerce Templates</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <div
                  key={template.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent 
                      size={24} 
                      className={selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600'} 
                    />
                    <div>
                      <h4 className={`font-medium ${
                        selectedTemplate === template.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Professional template for e-commerce product descriptions
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedTemplate}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              Insert Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateDialog;
