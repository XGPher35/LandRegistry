"use client";

import Link from "next/link";
import {
  Shield,
  Eye,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Users,
  TrendingUp,
  MapPin
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Immutable Records",
    description: "Once registered, land records cannot be altered or deleted. Your ownership is cryptographically secured.",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Eye,
    title: "Transparent Verification",
    description: "Anyone can verify land ownership instantly. No more closed-door deals or hidden information.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transactions confirm in under a second on Solana. Transfer ownership in minutes, not weeks.",
    gradient: "from-purple-500 to-purple-600",
  },
];

const stats = [
  { value: "1000+", label: "Lands Registered", icon: MapPin },
  { value: "500+", label: "Verified Transfers", icon: FileCheck },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
  { value: "0", label: "Fraud Cases", icon: Shield },
];

const howItWorks = [
  {
    step: "01",
    title: "Government Registration",
    description: "Authorized officials register verified land records on the blockchain with unique identifiers.",
  },
  {
    step: "02",
    title: "Owner Verification",
    description: "Land owners connect their wallet to view and manage their registered properties.",
  },
  {
    step: "03",
    title: "Secure Transfer",
    description: "Initiate ownership transfers with multi-party approval from buyer and government.",
  },
  {
    step: "04",
    title: "Permanent Record",
    description: "Every transaction is permanently recorded on-chain with complete audit trail.",
  },
];

export default function Home() {
  return (
    <div className="hero-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-full mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Powered by Solana Blockchain
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Nepal Land Registry
            </h1>
            <p className="text-2xl sm:text-3xl font-medium gradient-text mb-4 animate-slide-up delay-100">
              मेरो माटो, मेरो अधिकार
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up delay-200">
              A secure, immutable, and transparent land ownership system.
              Protecting your land rights with the power of blockchain technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
              <Link
                href="/public"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
              >
                Verify Land Ownership
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/gov"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                Government Portal
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in delay-400">
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Government Approved</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Decentralized</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Fraud-Proof</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Blockchain for Land Registry?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Traditional paper-based systems are vulnerable to fraud, loss, and corruption.
              Our blockchain solution solves these fundamental problems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 card-hover"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A simple, transparent process for managing land ownership on the blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-red-500 to-blue-500" />
                )}

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 relative z-10">
                  <span className="text-5xl font-bold gradient-text opacity-20">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-800">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6">
                🚫 The Problem with Paper Records
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Lost Records:</strong> Paper documents deteriorate, burn, or go missing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Fraud & Double Selling:</strong> Same plot sold to multiple buyers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Easy Tampering:</strong> Bribes can alter official records
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Bureaucratic Hell:</strong> Weeks of running between offices
                  </span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6">
                ✅ Our Blockchain Solution
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Permanent Storage:</strong> Records distributed across thousands of nodes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Instant Verification:</strong> Check ownership in seconds before purchasing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Tamper-Proof:</strong> Cryptographically secured, impossible to alter
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Fast Transfers:</strong> Complete ownership transfer in minutes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-nepal rounded-3xl p-12 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Secure Your Land Rights?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                Join the future of land registry in Nepal. Verify your land ownership
                or register new lands through the government portal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/public"
                  className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                >
                  Verify Land Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/owner"
                  className="bg-white/20 hover:bg-white/30 font-semibold px-8 py-3 rounded-xl transition-colors border border-white/30 inline-flex items-center justify-center gap-2"
                >
                  View My Land
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
