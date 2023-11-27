import {useServiceCall} from "Frontend/util/Service";
import {useState} from "react";
import {useForm, UseFormResult} from "@hilla/react-form";
import {AbstractModel, DetachedModelConstructor} from "@hilla/form";

export type UseFormControllerOptions<ID, T, M extends AbstractModel<T>> = {
    saveFunction: (data: T) => Promise<T>;
    loadFunction: (id: ID) => Promise<T | undefined>;
    idExtractor: (data: T) => ID | undefined;
    model: DetachedModelConstructor<M>;
    onNew?: () => void;
    onEdit?: (data: T) => void;
    onSave?: (data: T) => void;
    onReset?: () => void;
}

export type FormController<ID, T, M extends AbstractModel<T>> = {
    readonly add: () => void;
    readonly edit: (id: ID) => void;
    readonly reset: () => void;
    readonly reload: () => void;
    readonly isNew: boolean;
    readonly isReset: boolean;
    readonly isSaving: boolean;
    readonly isSavingError: boolean;
    readonly isLoading: boolean;
    readonly isLoadingError: boolean;
    readonly id: ID | undefined | null;
    readonly form: UseFormResult<M>
}

export function useFormController<ID, T, M extends AbstractModel<T>>(options: UseFormControllerOptions<ID, T, M>): FormController<ID, T, M> {
    const [isReset, setReset] = useState(true);
    const [id, setId] = useState<ID>();
    const saveService = useServiceCall({
        serviceFunction: options.saveFunction
    });
    const form = useForm(options.model, {
        onSubmit: saveService.callAsync
    });
    const loadService = useServiceCall({
        serviceFunction: options.loadFunction,
        onSuccess: data => {
            console.debug("useFormController", options, "Loaded", data);
            if (data) {
                form.read(data as any);
                setId(options.idExtractor(data));
            } else {
                reset();
            }
        }
    });
    const add = () => {
        console.debug("useFormController", options, "Adding");
        loadService.reset();
        saveService.reset();
        form.clear();
        setId(undefined);
        setReset(false);
    };
    const edit = (id: ID) => {
        console.debug("useFormController", options, "Editing", id);
        loadService.call(id);
        setId(id);
        setReset(false);
    };
    const reset = () => {
        console.debug("useFormController", options, "Resetting");
        loadService.reset();
        saveService.reset();
        form.clear();
        setId(undefined);
        setReset(true);
    };
    const reload = () => {
        if (id) {
            console.debug("useFormController", options, "Reloading", id);
            loadService.call(id);
        }
    }
    return {
        add: add,
        edit: edit,
        reset: reset,
        reload: reload,
        isNew: id === undefined,
        isReset: isReset,
        isSaving: saveService.isPending,
        isSavingError: saveService.isError,
        isLoading: loadService.isPending,
        isLoadingError: loadService.isError,
        id: id,
        form: form
    };
}