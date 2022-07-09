import Error from "next/error";

const Error404 = () => {
    return (
        <div className="w-full h-screen justify-center items-center">
            <Error statusCode={404} />
        </div>
    )
}

export default Error404;