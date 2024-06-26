import useSWR from "swr";

const err = false;

// NOTE: no comments, don't know what this is doing, why this is here
export default function Temp() {
  const { data, error } = useSWR("/api/test", (...args) => {
    console.log("args", args);
    return new Promise<string>((res, rej) => {
      setTimeout(() => {
        if (err) {
          rej("500");
        } else {
          res("demo");
        }
      }, 2000);
    });
  });
  console.log("data", data);
  console.log("err", error);
  return <div>{data ?? "no data"}</div>;
}
