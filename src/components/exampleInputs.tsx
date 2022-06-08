import React, {FC} from "react";

interface ExampleInter {
    name: string,
    examples: string[],
    message: string
}

const Example = (example: ExampleInter): JSX.Element => {
    let exString = example.examples.map(string => `${string}, `)
    return (
        <div className="example">
            <p><b>{example.name}: </b>{exString}</p>
            <p>{example.message}</p>
        </div>)
}

export default Example;