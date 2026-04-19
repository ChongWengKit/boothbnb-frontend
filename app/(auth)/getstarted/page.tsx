"use client"
import React from "react";
import Link from "next/link";
import GoogleSignIn from "@/app/(auth)/components/GoogleSignIn";
import PublicLayout from "@/app/(auth)/layout";

function LogIn() {
    return (
            <div className="bg-background p-8 rounded-2xl shadow-lg">
                <h2 className="text-4xl font-extrabold text-center mb-8">BoothBnB</h2>
                <div className="flex flex-col gap-8">
                    <Link href="/login">
                        <button className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                            Log In
                        </button>
                    </Link>
                    <Link href="/signup">
                        <button className="w-full bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-full hover:bg-muted transition-colors">
                            Create an Account
                        </button>
                    </Link>
                    <p className="text-center text-muted-foreground">or continue with</p>
                    <GoogleSignIn />
                </div>
            </div>
    )
}

export default LogIn;