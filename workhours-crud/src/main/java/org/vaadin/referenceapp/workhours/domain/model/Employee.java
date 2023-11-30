package org.vaadin.referenceapp.workhours.domain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JavaType;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.BigIntJdbcType;
import org.vaadin.referenceapp.workhours.domain.base.BaseAuditedEntity;
import org.vaadin.referenceapp.workhours.domain.primitives.EmployeeId;
import org.vaadin.referenceapp.workhours.domain.primitives.UserId;
import org.vaadin.referenceapp.workhours.domain.primitives.hibernate.EmployeeIdJavaType;
import org.vaadin.referenceapp.workhours.domain.primitives.jpa.UserIdAttributeConverter;

@Entity
@Table(name = "employees")
public class Employee extends BaseAuditedEntity<EmployeeId> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JavaType(EmployeeIdJavaType.class)
    @JdbcType(BigIntJdbcType.class)
    private EmployeeId id;

    @Column(name = "user_id", unique = true)
    @Convert(converter = UserIdAttributeConverter.class)
    private UserId user;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    // TODO Add validation

    @Override
    public EmployeeId getId() {
        return id;
    }

    public UserId getUser() {
        return user;
    }

    public void setUser(UserId user) {
        this.user = user;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
