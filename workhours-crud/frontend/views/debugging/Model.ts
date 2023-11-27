import {
    _getPropertyModel as _getPropertyModel_1,
    makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1,
    NumberModel as NumberModel_1,
    ObjectModel as ObjectModel_1,
    StringModel as StringModel_1
} from "@hilla/form";
import ContractReferenceModel_1
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ContractReferenceModel.js";
import HourCategoryReferenceModel_1
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/HourCategoryReferenceModel.js";
import ProjectReferenceModel_1
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/reference/ProjectReferenceModel.js";
import type WorkLogEntryFormDTO_1
    from "Frontend/generated/org/vaadin/referenceapp/workhours/adapter/hilla/worklog/WorkLogEntryFormDTO.js";

class WorkLogEntryFormDTOModel<T extends WorkLogEntryFormDTO_1 = WorkLogEntryFormDTO_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(WorkLogEntryFormDTOModel);

    get id(): NumberModel_1 {
        return this[_getPropertyModel_1]("id", (parent, key) => new NumberModel_1(parent, key, true, {meta: {javaType: "java.lang.Long"}}));
    }

    get project(): ProjectReferenceModel_1 {
        return this[_getPropertyModel_1]("project", (parent, key) => new ProjectReferenceModel_1(parent, key, true));
    }

    get contract(): ContractReferenceModel_1 {
        return this[_getPropertyModel_1]("contract", (parent, key) => new ContractReferenceModel_1(parent, key, true));
    }

    get date(): StringModel_1 {
        return this[_getPropertyModel_1]("date", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.time.LocalDate"}}));
    }

    get startTime(): StringModel_1 {
        return this[_getPropertyModel_1]("startTime", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.time.LocalTime"}}));
    }

    get endTime(): StringModel_1 {
        return this[_getPropertyModel_1]("endTime", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.time.LocalTime"}}));
    }

    get description(): StringModel_1 {
        return this[_getPropertyModel_1]("description", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.lang.String"}}));
    }

    get hourCategory(): HourCategoryReferenceModel_1 {
        return this[_getPropertyModel_1]("hourCategory", (parent, key) => new HourCategoryReferenceModel_1(parent, key, true));
    }

    get createdBy(): StringModel_1 {
        return this[_getPropertyModel_1]("createdBy", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.lang.String"}}));
    }

    get createdOn(): StringModel_1 {
        return this[_getPropertyModel_1]("createdOn", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.time.Instant"}}));
    }

    get modifiedBy(): StringModel_1 {
        return this[_getPropertyModel_1]("modifiedBy", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.lang.String"}}));
    }

    get modifiedOn(): StringModel_1 {
        return this[_getPropertyModel_1]("modifiedOn", (parent, key) => new StringModel_1(parent, key, true, {meta: {javaType: "java.time.Instant"}}));
    }
}

export default WorkLogEntryFormDTOModel;
