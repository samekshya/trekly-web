"use client";

import { useEffect, useState } from "react";

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  trekId: string;
}

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{
            fontSize: 28,
            cursor: onChange ? "pointer" : "default",
            color: star <= (hovered || value) ? "#f59e0b" : "#e2e8f0",
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ReviewSection({ trekId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5050/api/reviews/${trekId}`);
      const json = await res.json();
      setReviews(json.data || []);
      setAvgRating(json.avgRating || 0);
      setTotal(json.total || 0);
    } catch {}
    setLoading(false);
  };

  const checkCanReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5050/api/reviews/${trekId}/can-review`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setCanReview(json.canReview);
      setAlreadyReviewed(json.alreadyReviewed);
    } catch {}
  };

  useEffect(() => {
    fetchReviews();
    checkCanReview();
  }, [trekId]);

  const handleSubmit = async () => {
    if (rating === 0) { setSubmitError("Please select a star rating"); return; }
    if (!comment.trim()) { setSubmitError("Please write a comment"); return; }

    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/reviews/${trekId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to submit review");

      setSubmitSuccess(true);
      setRating(0);
      setComment("");
      setCanReview(false);
      setAlreadyReviewed(true);
      fetchReviews();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        padding: "32px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        marginTop: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Reviews
        </h2>
        {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28, color: "#f59e0b" }}>★</span>
            <span
              style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}
            >
              {avgRating}
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              ({total} {total === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {/* Write a review form */}
      {canReview && (
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: 16,
            padding: "24px",
            border: "1px solid #e2e8f0",
            marginBottom: 28,
          }}
        >
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 16,
            }}
          >
            Write a Review
          </p>

          <div style={{ marginBottom: 14 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
                letterSpacing: "0.04em",
              }}
            >
              YOUR RATING
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
                letterSpacing: "0.04em",
              }}
            >
              YOUR REVIEW
            </p>
            <textarea
              rows={3}
              placeholder="Share your experience on this trek..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid #e2e8f0",
                backgroundColor: "white",
                fontSize: 14,
                color: "#0f172a",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {submitError && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>
              {submitError}
            </p>
          )}
          {submitSuccess && (
            <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 12 }}>
              ✅ Review submitted successfully!
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "12px 28px",
              backgroundColor: submitting ? "#86efac" : "#16a34a",
              color: "white",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Already reviewed message */}
      {alreadyReviewed && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
            fontSize: 13,
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          ✅ You have already reviewed this trek
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🏔️</p>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                padding: "18px 20px",
                backgroundColor: "#f8fafc",
                borderRadius: 14,
                border: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 4px",
                    }}
                  >
                    {review.userName}
                  </p>
                  <StarRating value={review.rating} />
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  margin: "10px 0 0",
                }}
              >
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}