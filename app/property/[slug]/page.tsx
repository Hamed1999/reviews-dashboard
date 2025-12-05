"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { isApproved, setApproved } from "../../../lib/approval";
import {
  FiHome,
  FiFilter,
  FiStar,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiChevronLeft,
} from "react-icons/fi";
import Link from "next/link";
import { useApprovalState } from "@/lib/useApprovalState";

type Review = {
  id: number;
  listing: string;
  rating: number | null;
  submittedAt: string;
  publicReview?: string;
  status: string;
  guestName?: string;
  categories: Record<string, number>;
};

export default function PropertyPage() {
  const params = useParams() as { slug?: string };
  const slug = params.slug ? decodeURIComponent(params.slug) : "";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showOnlyApproved, setShowOnlyApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isApproved, setApproved } = useApprovalState();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews/hostaway?listing=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: { result?: Review[] }) => {
        setReviews(data.result ?? []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const approvedReviews = useMemo(
    () => reviews.filter((r) => isApproved(r.id)),
    [reviews, isApproved]
  );

  const visible = showOnlyApproved ? approvedReviews : reviews;
  const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  function toggleApproval(id: number) {
    const current = isApproved(id);
    setApproved(id, !current);
    setReviews((s) => [...s]); // Trigger re-render
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <FiHome className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {slug}
                </h1>
              </div>
              <p className="text-gray-600">
                Manage and moderate reviews for this property
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FiMessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Reviews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm text-gray-600">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedReviews.length}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowOnlyApproved(!showOnlyApproved)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    showOnlyApproved
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showOnlyApproved ? (
                    <>
                      <FiEye className="w-4 h-4" />
                      Showing Approved Only
                    </>
                  ) : (
                    <>
                      <FiEyeOff className="w-4 h-4" />
                      Show All Reviews
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FiFilter className="w-4 h-4" />
                  <span>
                    Showing {visible.length} of {reviews.length} reviews
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const confirmReset = window.confirm(
                      "Are you sure you want to reset all approvals for this property?"
                    );
                    if (confirmReset) {
                      reviews.forEach((r) => setApproved(r.id, false));
                      setReviews((s) => [...s]);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Reset All Approvals
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reviews List (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {showOnlyApproved ? "Approved Reviews" : "All Reviews"}
              </h2>

              {visible.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                  <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews found
                  </h3>
                  <p className="text-gray-600">
                    {showOnlyApproved
                      ? "No approved reviews yet. Approve some reviews to see them here."
                      : "No reviews available for this property."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visible.map((r) => {
                    const approved = isApproved(r.id);
                    return (
                      <div
                        key={r.id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full">
                                <FiUser className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {r.guestName ?? "Anonymous Guest"}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FiCalendar className="w-3 h-3" />
                                    {new Date(
                                      r.submittedAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {r.rating && (
                                    <span className="flex items-center gap-1">
                                      <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                                      {r.rating}/10
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">
                              {r.publicReview ?? "No review text provided"}
                            </p>

                            {r.categories &&
                              Object.keys(r.categories).length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {Object.entries(r.categories).map(
                                    ([k, v]) => (
                                      <span
                                        key={k}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                      >
                                        {k}: {v}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="shrink-0">
                            <div className="flex flex-col items-end gap-3">
                              <button
                                onClick={() => toggleApproval(r.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                  approved
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                                }`}
                              >
                                {approved ? (
                                  <>
                                    <FiCheckCircle className="w-4 h-4" />
                                    Approved
                                  </>
                                ) : (
                                  <>
                                    <FiXCircle className="w-4 h-4" />
                                    Approve
                                  </>
                                )}
                              </button>

                              <div className="text-xs text-gray-500">
                                Status:{" "}
                                <span
                                  className={`font-medium ${
                                    approved
                                      ? "text-emerald-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {approved ? "Public" : "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Public Preview (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Public Preview
                  </h3>
                  <p className="text-blue-100 text-sm">
                    This is how approved reviews will appear to visitors
                  </p>
                </div>

                <div className="p-6">
                  {approvedReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No approved reviews yet. Approve reviews to see them
                        here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {approvedReviews.map((r) => (
                        <div
                          key={r.id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor((r.rating || 0) / 2)
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {r.rating}/10
                            </span>
                          </div>

                          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                            {r.publicReview}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-medium">
                              {r.guestName ?? "Guest"}
                            </span>
                            <span>
                              {new Date(r.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {approvedReviews.length} approved reviews
                      </p>
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Live on your site
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Review Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-medium">{reviews.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Approved</span>
                    <span className="font-medium text-emerald-600">
                      {approvedReviews.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium text-amber-600">
                      {reviews.length - approvedReviews.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Rating</span>
                    <span className="font-medium">
                      {averageRating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
