import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// If you have access to the Challenge interface, you could define this type

export const CreateChallenge: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState("web");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [flag, setFlag] = useState("");
  const { createChallenge } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const challengeData = {
        name,
        description,
        ...(url && { url }), // Only include url if it exists
        points,
        category,
        author,
        flag,
        date,
      };
      
      await createChallenge(challengeData);
      navigate("/challenges");
    } catch (error) {
      console.error("Challenge creation failed:", error);
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Challenge
        </CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">
          Fill in the details to create a new challenge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Challenge Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the challenge name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="url"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              URL (Optional)
            </label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the challenge URL (optional)"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="points"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Points
            </label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="Enter points for the challenge"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full"
            >
              <option value="reversing">Reversing</option>
              <option value="osint">OSINT</option>
              <option value="pwn">PWN</option>
              <option value="web">Web</option>
              <option value="forensics">Forensics</option>
              <option value="crypto">Crypto</option>
              <option value="stego">Stego</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="author"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Author
            </label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter the author's name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date
            </label>
            <Input
              id="date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Enter the date"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="flag"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Flag
            </label>
            <Input
              id="flag"
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter the flag"
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Challenge
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Want to see all challenges?{" "}
          <Link
            to="/challenges"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            View challenges here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
