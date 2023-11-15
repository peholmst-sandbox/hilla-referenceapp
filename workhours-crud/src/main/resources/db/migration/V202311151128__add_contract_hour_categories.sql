CREATE TABLE contract_hour_categories
(
    contract_id      BIGINT NOT NULL,
    hour_category_id BIGINT NOT NULL,
    PRIMARY KEY (contract_id, hour_category_id),
    FOREIGN KEY (contract_id) REFERENCES contracts (id),
    FOREIGN KEY (hour_category_id) REFERENCES hour_categories (id)
);
