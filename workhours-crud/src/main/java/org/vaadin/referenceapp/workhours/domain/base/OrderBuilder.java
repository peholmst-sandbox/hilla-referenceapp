package org.vaadin.referenceapp.workhours.domain.base;

import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.domain.Sort;

public final class OrderBuilder<T> {

    private final StringBuilder sb = new StringBuilder();

    private OrderBuilder() {
    }

    public static <T> OrderBuilder<T> of(SingularAttribute<?, T> attribute) {
        var builder = new OrderBuilder<T>();
        builder.sb.append(attribute.getName());
        return builder;
    }

    @SuppressWarnings("unchecked")
    public <X> OrderBuilder<X> then(SingularAttribute<T, X> attribute) {
        sb.append(".").append(attribute.getName());
        return (OrderBuilder<X>) this;
    }

    public Sort.Order asc() {
        return Sort.Order.asc(sb.toString());
    }

    public Sort.Order desc() {
        return Sort.Order.desc(sb.toString());
    }
}
