import {
    type GridDataProviderParams,
    type GridSorterDefinition,
    type GridSorterDirection
} from "@hilla/react-components/Grid";
import Pageable from "Frontend/generated/dev/hilla/mappedtypes/Pageable";
import Order from "Frontend/generated/dev/hilla/mappedtypes/Order";
import Direction from "Frontend/generated/org/springframework/data/domain/Sort/Direction";

function gridSorterDirectionToSortDirection(dir: GridSorterDirection): Direction {
    if (dir === "desc") {
        return Direction.DESC;
    } else {
        return Direction.ASC;
    }
}

function gridSorterDefinitionToOrder(def: GridSorterDefinition): Order {
    return {
        property: def.path,
        direction: gridSorterDirectionToSortDirection(def.direction),
        ignoreCase: true
    };
}

export function gridDataProviderParamsToPageable(params: GridDataProviderParams<any>): Pageable {
    return {
        pageSize: params.pageSize,
        pageNumber: params.page,
        sort: {
            orders: params.sortOrders.map(gridSorterDefinitionToOrder)
        }
    }
}
