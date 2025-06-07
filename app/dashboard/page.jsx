"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // New issue form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserId(data.session.user.id);
      } else {
        router.push("/auth/login"); // redirect if no user
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        router.push("/auth/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    async function fetchIssues() {
      setLoading(true);
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching issues:", error);
      } else {
        setIssues(data);
      }
      setLoading(false);
    }

    fetchIssues();
  }, [userId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Title is required");
      return;
    }

    const { error } = await supabase.from("issues").insert([
      {
        title,
        description,
        status,
        user_id: userId,
      },
    ]);

    if (error) {
      alert("Error creating issue: " + error.message);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Open");

      // Refresh issues after creation
      const { data, error: fetchError } = await supabase
        .from("issues")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching issues:", fetchError);
      } else {
        setIssues(data);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this issue?")) return;

    const { error } = await supabase.from("issues").delete().eq("id", id);

    if (error) {
      alert("Error deleting issue: " + error.message);
    } else {
      setIssues((prev) => prev.filter((issue) => issue.id !== id));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("issues")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setIssues((prev) =>
        prev.map((issue) => (issue.id === id ? { ...issue, status: newStatus } : issue))
      );
    }
  };

  // ** Logout function **
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error signing out: " + error.message);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Issue Tracker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleCreate} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Issue
        </button>
      </form>

      {loading ? (
        <p>Loading issues...</p>
      ) : issues.length === 0 ? (
        <p>No issues yet.</p>
      ) : (
        <ul className="space-y-4">
          {issues.map(({ id, title, description, status }) => (
            <li key={id} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="my-2">{description || <i>No description</i>}</p>
              <div className="flex items-center justify-between">
                <select
                  className="border p-1 rounded"
                  value={status}
                  onChange={(e) => handleStatusChange(id, e.target.value)}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}