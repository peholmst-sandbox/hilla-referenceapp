CREATE TABLE projects
(
    id           BIGSERIAL    NOT NULL,
    created_on   TIMESTAMP WITH TIME ZONE,
    created_by   VARCHAR(255),
    modified_on  TIMESTAMP WITH TIME ZONE,
    modified_by  VARCHAR(255),
    project_name VARCHAR(300) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE contracts
(
    id            BIGSERIAL    NOT NULL,
    created_on    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(255),
    modified_on   TIMESTAMP WITH TIME ZONE,
    modified_by   VARCHAR(255),
    project_id    BIGINT       NOT NULL,
    contract_name VARCHAR(300) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE TABLE hour_categories
(
    id                 BIGSERIAL    NOT NULL,
    created_on         TIMESTAMP WITH TIME ZONE,
    created_by         VARCHAR(255),
    modified_on        TIMESTAMP WITH TIME ZONE,
    modified_by        VARCHAR(255),
    hour_category_name VARCHAR(300) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE contract_hour_categories
(
    contract_id      BIGINT NOT NULL,
    hour_category_id BIGINT NOT NULL,
    PRIMARY KEY (contract_id, hour_category_id),
    FOREIGN KEY (contract_id) REFERENCES contracts (id),
    FOREIGN KEY (hour_category_id) REFERENCES hour_categories (id)
);

CREATE TABLE employees
(
    id          BIGSERIAL                NOT NULL,
    created_on  TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by  VARCHAR(255)             NOT NULL,
    modified_on TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by VARCHAR(255)             NOT NULL,
    first_name  VARCHAR(255)             NOT NULL,
    last_name   VARCHAR(255)             NOT NULL,
    user_id     VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (user_id)
);

CREATE TABLE work_log_entries
(
    id               BIGSERIAL                NOT NULL,
    created_on       TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by       VARCHAR(255)             NOT NULL,
    modified_on      TIMESTAMP WITH TIME ZONE NOT NULL,
    modified_by      VARCHAR(255)             NOT NULL,
    project_id       BIGINT                   NOT NULL,
    contract_id      BIGINT                   NOT NULL,
    hour_category_id BIGINT                   NOT NULL,
    employee_id      BIGINT                   NOT NULL,
    start_time       TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time         TIMESTAMP WITH TIME ZONE NOT NULL,
    description      VARCHAR(3000),
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects (id),
    FOREIGN KEY (contract_id) REFERENCES contracts (id),
    FOREIGN KEY (hour_category_id) REFERENCES hour_categories (id),
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);
