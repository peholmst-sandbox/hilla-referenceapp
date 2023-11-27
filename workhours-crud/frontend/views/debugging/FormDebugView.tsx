import {FormLayout} from "@hilla/react-components/FormLayout";
import {useForm, useFormPart} from "@hilla/react-form";
import {useEffect, useState} from "react";
import {
    _getPropertyModel,
    makeObjectEmptyValueCreator,
    NotBlank,
    NumberModel,
    ObjectModel,
    StringModel
} from "@hilla/form";
import {Button} from "@hilla/react-components/Button.js";
import {TextField} from "@hilla/react-components/TextField";

interface ProjectDTO {
    id?: number;
    name: string;
}

class ProjectDTOModel<T extends ProjectDTO> extends ObjectModel<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator(ProjectDTOModel);

    get id(): NumberModel {
        return this[_getPropertyModel]("id", (parent, key) => new NumberModel(parent, key, true, {meta: {javaType: "java.lang.Long"}}));
    }

    get name(): StringModel {
        return this[_getPropertyModel]("name", (parent, key) => new StringModel(parent, key, true, {meta: {javaType: "java.lang.String"}}));
    }
}

export function FormDebugView() {
    const {model, field, value, clear, read} = useForm(ProjectDTOModel);
    const nameField = useFormPart(model.name);

    useEffect(() => {
        nameField.addValidator(new NotBlank({message: "Please enter a name."}));
    }, []);

    const [formVisible, setFormVisible] = useState(false);

    function load() {
        const ts = Date.now();
        read({
            id: ts,
            name: "Test " + ts
        });
    }

    return <>
        <Button onClick={clear}>Clear Form</Button>
        <Button onClick={load}>Load Form</Button>
        <Button onClick={() => setFormVisible(true)}>Show Form</Button>
        <Button onClick={() => setFormVisible(false)}>Hide Form</Button>
        {formVisible && (<FormLayout>
            <TextField label={"Project name"} {...field(model.name)}/>
        </FormLayout>)}
        <p>Form value: {JSON.stringify(value)}</p>
    </>;
}