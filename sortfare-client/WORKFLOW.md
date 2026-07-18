# AI workflow comparison: settings form drill

This exercise compared two implementations of the same feature: a notification-settings form with validation and a small browser UI. The first branch used a vague one-line prompt and accepted the result without much review. The second branch used a precise prompt that specified the target files, expected validation behavior, accessibility requirements, and a verification step to write tests and run them.

The most visible difference was not just code quality; it was the amount of review work required after generation. The vague round produced a functioning form quickly, but it left several gaps: it lacked an explicit test harness, did not guard against unsupported interval values, and required extra manual review to make the UX robust. The precise round still needed human oversight, but the implementation arrived with a clearer structure, explicit validation rules, and a test suite that immediately surfaced edge cases.

One concrete AI mistake I caught was the assumption that any non-empty string should be accepted as a valid email. That would have allowed malformed addresses to slip through. The precise prompt prevented that by requiring a real validation rule, and the tests made the mistake observable. Another issue was accessibility: the initial pass did not clearly tie helper text to inputs, while the second pass added ARIA descriptions and live status messaging so screen-reader users would receive feedback.

The diff also showed a difference in effort. The vague pass felt faster at first, but it created more follow-up work for verification and cleanup. The precise pass was slower to author, yet faster end to end once the tests and accessibility checks were included. That is the central lesson: better prompting and explicit verification reduce downstream review time, even if the initial generation step takes longer.

The main project-specific rules that emerged were: validate form input in shared logic rather than only in the browser, add tests for edge cases before claiming a feature is complete, and preserve accessibility by connecting error text and status updates to form controls.
