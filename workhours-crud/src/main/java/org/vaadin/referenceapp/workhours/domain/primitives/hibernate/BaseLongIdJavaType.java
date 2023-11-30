package org.vaadin.referenceapp.workhours.domain.primitives.hibernate;

import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractClassJavaType;
import org.hibernate.type.descriptor.jdbc.JdbcType;
import org.hibernate.type.descriptor.jdbc.JdbcTypeIndicators;
import org.vaadin.referenceapp.workhours.domain.primitives.BaseLongId;

import java.sql.Types;
import java.util.function.Function;

public abstract class BaseLongIdJavaType<T extends BaseLongId> extends AbstractClassJavaType<T> {

    private final Function<String, T> fromStringTransformer;
    private final Function<Long, T> fromLongTransformer;

    public BaseLongIdJavaType(Class<T> type, Function<String, T> fromStringTransformer, Function<Long, T> fromLongTransformer) {
        super(type);
        this.fromStringTransformer = fromStringTransformer;
        this.fromLongTransformer = fromLongTransformer;
    }

    @Override
    public JdbcType getRecommendedJdbcType(JdbcTypeIndicators indicators) {
        return indicators.getJdbcType(Types.BIGINT);
    }

    @SuppressWarnings("unchecked")
    @Override
    public <X> X unwrap(T value, Class<X> type, WrapperOptions wrapperOptions) {
        if (value == null) {
            return null;
        }
        if (Long.class.isAssignableFrom(type)) {
            return (X) value.toLong();
        }
        if (String.class.isAssignableFrom(type)) {
            return (X) value.toString();
        }
        throw unknownUnwrap(type);
    }

    @Override
    public <X> T wrap(X value, WrapperOptions wrapperOptions) {
        if (value == null) {
            return null;
        }
        if (value instanceof Long) {
            return fromLongTransformer.apply((Long) value);
        }
        if (value instanceof String) {
            return fromStringTransformer.apply((String) value);
        }
        throw unknownWrap(value.getClass());
    }
}
