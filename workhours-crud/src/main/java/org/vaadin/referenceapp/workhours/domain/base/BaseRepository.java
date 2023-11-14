package org.vaadin.referenceapp.workhours.domain.base;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.lang.Nullable;

import java.io.Serializable;
import java.util.Optional;
import java.util.stream.Stream;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity<ID>, ID extends Serializable> extends JpaRepository<T, ID> {

    int DEFAULT_UPPER_LIMIT = 1000;

    default T getById(@Nullable ID id) {
        return Optional.ofNullable(id)
                .flatMap(this::findById)
                .orElseThrow(() -> new IncorrectResultSizeDataAccessException("Entity does not exist", 1, 0));
    }

    default Stream<T> findAllWithUpperLimit(int limit) {
        var page = findAll(Pageable.ofSize(limit + 1));
        if (page.getNumberOfElements() > limit) {
            throw new IncorrectResultSizeDataAccessException("Upper limit reached", limit, page.getNumberOfElements());
        } else {
            return page.get();
        }
    }

    default Stream<T> findAllWithUpperLimit() {
        return findAllWithUpperLimit(DEFAULT_UPPER_LIMIT);
    }
}
