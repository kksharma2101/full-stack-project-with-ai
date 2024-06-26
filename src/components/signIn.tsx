import { signIn } from "@/../auth"

export async function SignIn() {
    return (
        <form
            action={async (formData) => {
                "use server"
                await signIn("credentials", formData)
            }}
        >
            <div className="flex justify-center items-center flex-col gap-5 mt-4">
                <div className="flex justify-center items-start flex-col gap-5">
                    <label>
                        <p>Email :</p>
                        <input name="email" type="email" className="border rounded-md p-1" />
                    </label>
                    <label>
                        <p>Password :</p>
                        <input name="password" type="password" className="border rounded-md p-1" />
                    </label>
                </div>
                <button className="border bg-blue-600 rounded-lg px-3 py-1">Sign In</button>
            </div>
        </form>
    )
}