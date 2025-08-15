INSERT INTO players (team_id, first_name, last_name, birth_date, nationality, position, height, weight, jersey_number, contract_start_year, contract_end_year, salary, college, draft_year, experience)
VALUES
(1, 'Patrick', 'Mahomes', '1995-09-17', 'American', 'Quarterback', '6-3', 230, 15, 2017, 2030, 45000000, 'Texas Tech', 2017, 8),
(1, 'Travis', 'Kelce', '1989-10-05', 'American', 'Tight End', '6-5', 250, 87, 2013, 2025, 14000000, 'Cincinnati', 2013, 12),
(1, 'Chris', 'Jones', '1994-07-03', 'American', 'Defensive Tackle', '6-6', 310, 95, 2016, 2026, 20000000, 'Mississippi State', 2016, 9),

(2, 'Josh', 'Allen', '1996-05-21', 'American', 'Quarterback', '6-5', 237, 17, 2018, 2028, 43000000, 'Wyoming', 2018, 7),
(2, 'Stefon', 'Diggs', '1993-11-29', 'American', 'Wide Receiver', '6-0', 191, 14, 2015, 2025, 24000000, 'Maryland', 2015, 10),
(2, 'Von', 'Miller', '1989-03-26', 'American', 'Linebacker', '6-3', 250, 40, 2011, 2024, 20000000, 'Texas A&M', 2011, 14),

(3, 'Aaron', 'Rodgers', '1983-12-02', 'American', 'Quarterback', '6-2', 225, 12, 2005, 2025, 35000000, 'Cal', 2005, 20),
(3, 'Davante', 'Adams', '1992-12-24', 'American', 'Wide Receiver', '6-1', 215, 17, 2014, 2025, 28000000, 'Fresno State', 2014, 11),
(3, 'Aaron', 'Jones', '1994-12-02', 'American', 'Running Back', '5-9', 208, 33, 2017, 2025, 12000000, 'UTEP', 2017, 8),

(4, 'Russell', 'Wilson', '1988-11-29', 'American', 'Quarterback', '5-11', 215, 3, 2012, 2025, 35000000, 'Wisconsin', 2012, 13),
(4, 'Bobby', 'Wagner', '1990-06-27', 'American', 'Linebacker', '6-0', 242, 54, 2012, 2025, 18000000, 'Utah State', 2012, 13),
(4, 'Tyler', 'Lockett', '1992-09-28', 'American', 'Wide Receiver', '5-10', 182, 16, 2015, 2025, 14000000, 'Kansas State', 2015, 10),

(5, 'Drew', 'Brees', '1979-01-15', 'American', 'Quarterback', '6-0', 209, 9, 2001, 2025, 25000000, 'Purdue', 2001, 24),
(5, 'Alvin', 'Kamara', '1995-07-25', 'American', 'Running Back', '6-0', 215, 41, 2017, 2025, 15000000, 'Tennessee', 2017, 8),
(5, 'Michael', 'Thomas', '1993-03-03', 'American', 'Wide Receiver', '6-3', 212, 13, 2016, 2025, 19000000, 'Ohio State', 2016, 9),

(6, 'Ben', 'Roethlisberger', '1982-03-02', 'American', 'Quarterback', '6-5', 240, 7, 2004, 2025, 30000000, 'Miami (OH)', 2004, 21),
(6, 'T.J.', 'Watt', '1994-10-11', 'American', 'Linebacker', '6-4', 252, 90, 2017, 2025, 28000000, 'Wisconsin', 2017, 8),
(6, 'Najee', 'Harris', '1998-03-09', 'American', 'Running Back', '6-1', 232, 22, 2021, 2025, 12000000, 'Alabama', 2021, 4),

(7, 'Matthew', 'Stafford', '1988-02-07', 'American', 'Quarterback', '6-3', 220, 9, 2009, 2025, 30000000, 'Georgia', 2009, 16),
(7, 'Aaron', 'Donald', '1991-05-23', 'American', 'Defensive Tackle', '6-1', 280, 99, 2014, 2025, 25000000, 'Purdue', 2014, 11),
(7, 'Cooper', 'Kupp', '1993-06-15', 'American', 'Wide Receiver', '6-2', 208, 10, 2017, 2025, 16000000, 'Eastern Washington', 2017, 8),

(8, 'Tom', 'Brady', '1977-08-03', 'American', 'Quarterback', '6-4', 225, 12, 2000, 2025, 25000000, 'Michigan', 2000, 25),
(8, 'Rob', 'Gronkowski', '1989-05-14', 'American', 'Tight End', '6-6', 268, 87, 2010, 2025, 12000000, 'Arizona', 2010, 15),
(8, 'Mike', 'Evans', '1993-08-18', 'American', 'Wide Receiver', '6-5', 231, 13, 2014, 2025, 22000000, 'Texas A&M', 2014, 11),

(9, 'Peyton', 'Manning', '1976-03-24', 'American', 'Quarterback', '6-5', 230, 18, 1998, 2025, 30000000, 'Tennessee', 1998, 27),
(9, 'Marvin', 'Harrison', '1972-08-25', 'American', 'Wide Receiver', '6-0', 175, 88, 1996, 2025, 20000000, 'Syracuse', 1996, 29),
(9, 'Edgerrin', 'James', '1978-08-01', 'American', 'Running Back', '6-0', 214, 32, 1999, 2025, 15000000, 'Miami (FL)', 1999, 26),

(10, 'Dan', 'Marino', '1961-09-15', 'American', 'Quarterback', '6-4', 228, 13, 1983, 2025, 25000000, 'Pittsburgh', 1983, 42),
(10, 'Larry', 'Csonka', '1946-12-25', 'American', 'Fullback', '6-3', 230, 39, 1968, 2025, 18000000, 'Syracuse', 1968, 57),
(10, 'Jason', 'Taylor', '1974-01-27', 'American', 'Defensive End', '6-6', 252, 99, 1997, 2025, 20000000, 'Akkademia', 1997, 28),

(11, 'Joe', 'Montana', '1956-06-11', 'American', 'Quarterback', '6-2', 211, 16, 1979, 2025, 30000000, 'Notre Dame', 1979, 46),
(11, 'Jerry', 'Rice', '1962-10-13', 'American', 'Wide Receiver', '6-2', 203, 80, 1985, 2025, 22000000, 'Mississippi Valley State', 1985, 40),
(11, 'Steve', 'Young', '1961-11-12', 'American', 'Quarterback', '6-2', 205, 8, 1985, 2025, 25000000, 'Brigham Young', 1985, 40),

(12, 'John', 'Elway', '1960-06-28', 'American', 'Quarterback', '6-3', 216, 7, 1983, 2025, 35000000, 'Stanford', 1983, 42),
(12, 'Terrell', 'Davis', '1972-10-28', 'American', 'Running Back', '6-1', 205, 30, 1995, 2025, 18000000, 'Georgia Southern', 1995, 30),
(12, 'Rod', 'Smith', '1974-05-15', 'American', 'Wide Receiver', '6-0', 180, 80, 1994, 2025, 15000000, 'Missouri Southern', 1994, 31),

(13, 'Jim', 'Kelly', '1960-03-14', 'American', 'Quarterback', '6-2', 205, 12, 1986, 2025, 25000000, 'Miami (FL)', 1986, 39),
(13, 'Thurman', 'Thomas', '1967-05-16', 'American', 'Running Back', '5-10', 200, 34, 1988, 2025, 18000000, 'Oklahoma State', 1988, 37),
(13, 'Andre', 'Reed', '1964-06-29', 'American', 'Wide Receiver', '6-2', 207, 83, 1985, 2025, 20000000, 'Kutztown', 1985, 40),

(14, 'Dan', 'Fouts', '1950-06-10', 'American', 'Quarterback', '6-2', 220, 14, 1973, 2025, 25000000, 'Oregon', 1973, 52),
(14, 'LaDainian', 'Tomlinson', '1979-06-23', 'American', 'Running Back', '6-1', 215, 21, 2001, 2025, 20000000, 'TCU', 2001, 24),
(14, 'Antonio', 'Gates', '1980-06-18', 'American', 'Tight End', '6-4', 255, 85, 2003, 2025, 12000000, 'Kent State', 2003, 22),

(15, 'Kurt', 'Warner', '1971-06-22', 'American', 'Quarterback', '6-2', 209, 13, 1998, 2025, 25000000, 'Northern Iowa', 1998, 27),
(15, 'Marshall', 'Faulk', '1973-02-18', 'American', 'Running Back', '6-0', 210, 28, 1994, 2025, 18000000, 'San Diego State', 1994, 31),
(15, 'Isaac', 'Bruce', '1966-11-10', 'American', 'Wide Receiver', '6-0', 188, 80, 1994, 2025, 15000000, 'Memphis', 1994, 31),

(16, 'Ben', 'Roethlisberger', '1982-03-02', 'American', 'Quarterback', '6-5', 240, 7, 2004, 2025, 30000000, 'Miami (OH)', 2004, 21),
(16, 'James', 'Conner', '1995-05-05', 'American', 'Running Back', '6-1', 233, 30, 2017, 2025, 12000000, 'Pittsburgh', 2017, 8),
(16, 'Chase', 'Claypool', '1998-07-07', 'American', 'Wide Receiver', '6-4', 238, 11, 2020, 2025, 14000000, 'Notre Dame', 2020, 5),

(17, 'Philip', 'Rivers', '1981-12-08', 'American', 'Quarterback', '6-5', 240, 17, 2004, 2025, 25000000, 'NC State', 2004, 21),
(17, 'LaDainian', 'Tomlinson', '1979-06-23', 'American', 'Running Back', '6-1', 215, 21, 2001, 2025, 20000000, 'TCU', 2001, 24),
(17, 'Antonio', 'Gates', '1980-06-18', 'American', 'Tight End', '6-4', 255, 85, 2003, 2025, 12000000, 'Kent State', 2003, 22),

(18, 'Matt', 'Ryan', '1985-05-17', 'American', 'Quarterback', '6-4', 217, 2, 2008, 2025, 30000000, 'Boston College', 2008, 17),
(18, 'Julio', 'Jones', '1989-02-08', 'American', 'Wide Receiver', '6-3', 220, 11, 2011, 2025, 20000000, 'Alabama', 2011, 14),
(18, 'Roddy', 'White', '1981-11-02', 'American', 'Wide Receiver', '6-0', 182, 84, 2005, 2025, 15000000, 'UAB', 2005, 20),

(19, 'Derek', 'Carr', '1991-03-28', 'American', 'Quarterback', '6-3', 210, 4, 2014, 2025, 25000000, 'Fresno State', 2014, 11),
(19, 'Josh', 'Jacobs', '1998-02-11', 'American', 'Running Back', '5-10', 220, 28, 2019, 2025, 12000000, 'Alabama', 2019, 6),
(19, 'Davante', 'Adams', '1992-12-24', 'American', 'Wide Receiver', '6-1', 215, 17, 2014, 2025, 28000000, 'Fresno State', 2014, 11),

(20, 'Brett', 'Favre', '1969-10-10', 'American', 'Quarterback', '6-2', 225, 4, 1991, 2025, 30000000, 'Southern Mississippi', 1991, 34),
(20, 'Reggie', 'White', '1961-12-19', 'American', 'Defensive End', '6-5', 295, 92, 1984, 2025, 25000000, 'Tennessee', 1984, 41),
(20, 'Antonio', 'Freeman', '1973-09-25', 'American', 'Wide Receiver', '6-0', 180, 86, 1995, 2025, 15000000, 'Virginia Tech', 1995, 30),

(21, 'Steve', 'McNair', '1973-02-14', 'American', 'Quarterback', '6-2', 230, 9, 1995, 2025, 25000000, 'Alcorn State', 1995, 30),
(21, 'Eddie', 'George', '1973-09-24', 'American', 'Running Back', '6-3', 215, 27, 1996, 2025, 18000000, 'Ohio State', 1996, 29),
(21, 'Chris', 'Carter', '1965-11-25', 'American', 'Wide Receiver', '6-3', 220, 80, 1987, 2025, 20000000, 'Ohio State', 1987, 38),

(22, 'Joe', 'Namath', '1943-05-31', 'American', 'Quarterback', '6-2', 205, 12, 1965, 2025, 25000000, 'Alabama', 1965, 60),
(22, 'Curtis', 'Martin', '1973-05-01', 'American', 'Running Back', '6-0', 210, 28, 1995, 2025, 18000000, 'Pittsburgh', 1995, 30),
(22, 'Laveranues', 'Coles', '1977-12-29', 'American', 'Wide Receiver', '6-0', 193, 87, 2000, 2025, 15000000, 'Florida State', 2000, 25),

(23, 'Troy', 'Aikman', '1966-11-21', 'American', 'Quarterback', '6-4', 220, 8, 1989, 2025, 30000000, 'UCLA', 1989, 36),
(23, 'Emmitt', 'Smith', '1969-05-15', 'American', 'Running Back', '5-9', 203, 22, 1990, 2025, 20000000, 'Florida', 1990, 35),
(23, 'Michael', 'Irvin', '1966-03-05', 'American', 'Wide Receiver', '6-2', 207, 88, 1988, 2025, 22000000, 'Miami (FL)', 1988, 37),

(24, 'John', 'Unitas', '1933-05-07', 'American', 'Quarterback', '6-1', 190, 19, 1956, 2025, 25000000, 'Louisville', 1956, 69),
(24, 'Jim', 'Brown', '1936-02-17', 'American', 'Running Back', '6-2', 232, 32, 1957, 2025, 18000000, 'Syracuse', 1957, 68),
(24, 'Don', 'Shula', '1930-01-04', 'American', 'Coach', NULL, NULL, NULL, 1963, 2025, 20000000, NULL, NULL, NULL),

(25, 'Joe', 'Montana', '1956-06-11', 'American', 'Quarterback', '6-2', 211, 16, 1979, 2025, 30000000, 'Notre Dame', 1979, 46),
(25, 'Barry', 'Sanders', '1968-07-16', 'American', 'Running Back', '5-8', 203, 20, 1989, 2025, 22000000, 'Oklahoma State', 1989, 36),
(25, 'Calvin', 'Johnson', '1985-09-29', 'American', 'Wide Receiver', '6-5', 239, 81, 2007, 2025, 20000000, 'Georgia Tech', 2007, 18),

(26, 'Dan', 'Fouts', '1950-06-10', 'American', 'Quarterback', '6-2', 220, 14, 1973, 2025, 25000000, 'Oregon', 1973, 52),
(26, 'Marcus', 'Allen', '1960-03-26', 'American', 'Running Back', '6-1', 210, 32, 1983, 2025, 18000000, 'USC', 1983, 42),
(26, 'Tim', 'Brown', '1966-07-05', 'American', 'Wide Receiver', '6-0', 205, 80, 1988, 2025, 15000000, 'Notre Dame', 1988, 37),

(27, 'Jim', 'Kelly', '1960-03-14', 'American', 'Quarterback', '6-2', 205, 12, 1986, 2025, 25000000, 'Miami (FL)', 1986, 39),
(27, 'Thurman', 'Thomas', '1967-05-16', 'American', 'Running Back', '5-10', 200, 34, 1988, 2025, 18000000, 'Oklahoma State', 1988, 37),
(27, 'Andre', 'Reed', '1964-06-29', 'American', 'Wide Receiver', '6-2', 207, 83, 1985, 2025, 20000000, 'Kutztown', 1985, 40),

(28, 'Joe', 'Namath', '1943-05-31', 'American', 'Quarterback', '6-2', 205, 12, 1965, 2025, 25000000, 'Alabama', 1965, 60),
(28, 'Curtis', 'Martin', '1973-05-01', 'American', 'Running Back', '6-0', 210, 28, 1995, 2025, 18000000, 'Pittsburgh', 1995, 30),
(28, 'Laveranues', 'Coles', '1977-12-29', 'American', 'Wide Receiver', '6-0', 193, 87, 2000, 2025, 15000000, 'Florida State', 2000, 25),

(29, 'Troy', 'Aikman', '1966-11-21', 'American', 'Quarterback', '6-4', 220, 8, 1989, 2025, 30000000, 'UCLA', 1989, 36),
(29, 'Emmitt', 'Smith', '1969-05-15', 'American', 'Running Back', '5-9', 203, 22, 1990, 2025, 20000000, 'Florida', 1990, 35),
(29, 'Michael', 'Irvin', '1966-03-05', 'American', 'Wide Receiver', '6-2', 207, 88, 1988, 2025, 22000000, 'Miami (FL)', 1988, 37),

(30, 'John', 'Unitas', '1933-05-07', 'American', 'Quarterback', '6-1', 190, 19, 1956, 2025, 25000000, 'Louisville', 1956, 69),
(30, 'Jim', 'Brown', '1936-02-17', 'American', 'Running Back', '6-2', 232, 32, 1957, 2025, 18000000, 'Syracuse', 1957, 68),
(30, 'Don', 'Shula', '1930-01-04', 'American', 'Coach', NULL, NULL, NULL, 1963, 2025, 20000000, NULL, NULL, NULL),

(31, 'Drew', 'Brees', '1979-01-15', 'American', 'Quarterback', '6-0', 209, 9, 2001, 2025, 25000000, 'Purdue', 2001, 24),
(31, 'Alvin', 'Kamara', '1995-07-25', 'American', 'Running Back', '6-0', 215, 41, 2017, 2025, 15000000, 'Tennessee', 2017, 8),
(31, 'Michael', 'Thomas', '1993-03-03', 'American', 'Wide Receiver', '6-3', 212, 13, 2016, 2025, 19000000, 'Ohio State', 2016, 9),

(32, 'Russell', 'Wilson', '1988-11-29', 'American', 'Quarterback', '5-11', 215, 3, 2012, 2025, 35000000, 'Wisconsin', 2012, 13),
(32, 'Bobby', 'Wagner', '1990-06-27', 'American', 'Linebacker', '6-0', 242, 54, 2012, 2025, 18000000, 'Utah State', 2012, 13),
(32, 'Tyler', 'Lockett', '1992-09-28', 'American', 'Wide Receiver', '5-10', 182, 16, 2015, 2025, 14000000, 'Kansas State', 2015, 10);

/* 
Add any additional data or teams as necessary
*/
