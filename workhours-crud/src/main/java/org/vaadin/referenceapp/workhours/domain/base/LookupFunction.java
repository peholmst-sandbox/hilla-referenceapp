package org.vaadin.referenceapp.workhours.domain.base;

import org.springframework.dao.IncorrectResultSizeDataAccessException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@FunctionalInterface
public interface LookupFunction<ID, T> {

    List<T> findByIds(Iterable<ID> ids);

    default <R> List<T> findByReferences(Iterable<R> references, Function<R, ID> idExtractor) {
        return findByIds(StreamSupport.stream(references.spliterator(), false).map(idExtractor).collect(Collectors.toList()));
    }

    default Optional<T> findById(ID id) {
        return findByIds(Set.of(id)).stream().findFirst();
    }

    default T getById(ID id) {
        return findById(id).orElseThrow(() -> new IncorrectResultSizeDataAccessException("Entity does not exist", 1, 0));
    }
}
