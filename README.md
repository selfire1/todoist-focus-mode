[![flowist. — Focus Mode for Todoist](https://raw.githubusercontent.com//selfire1/todoist-focus-mode/main/imgs/banner-mobile.png)](https://flowist.joschua.io)

<div align="center">
Flowist is your Focus Mode companion for Todoist.

**[Get Started](https://flowist.joschua.io/)**

_This application is not created by, affiliated with, or supported by Doist._

</div>

## The Task Freeze effect

> “This way of work and organisation that’s so common in modern life, where we have a lot of very varied things that have to be done, all mixed together all at once, really is incompatible with our brain.”
> – _Cal Newport_<sup>[Source](https://youtu.be/aOWL59-y82I?t=130)</sup>

Todo lists are inhumane. When we see a list of tasks that is long and diverse the planning apparatus of our brain locks up. It can't deal with these 10 or 15 things that all have to be done, so it freezes. No motivation is generated, nothing gets ticked off the todo list, procrastination kicks in.

## One Thing at a Time

Instead of a long diverse list, Flowist cuts out the noise and helps you focus on the task at hand. Start it on your phone or a second monitor and have what you're working on always in front of you. One thing, visible and clear. Our brains can do that. Stop the overwhelm and get into flow.

## Get Started

Flowist is free and open source. It was built as a solution to a problem I faced and I hope it helps you too. Simply log in with Todoist and get focused.

**[Open Flowist](https://flowist.joschua.io/)**

---

## Documentation

Flowist is built with simplicity in mind. Still, there are a handful of features to help you hone in on what is important.

### Filters

Enter a valid [Todoist filter](https://todoist.com/help/articles/introduction-to-filters) to only work on matching tasks. Only want to dig in on what is really important? Enter `p1` and start working on your highest priority tasks.

### Sorting

Sort tasks by due date, project or priority through url parameters. The schema is: `https://flowist.joschua.io/secure/?sort=[due|proj|prio]:[asc|desc]`.

- Sort all tasks by priority descending (from p1 to p4):`https://flowist.joschua.io/secure/?sort=prio:desc`
- Sort all tasks by due date ascending (earliest due date first): `https://flowist.joschua.io/secure/?sort=due:asc`
- Sorting by multiple values is supported. Sort first by priority, on equal priority sort by projects: `https://flowist.joschua.io/secure/?sort=p1:desc,proj:asc`

### URL scheme

Both filters and sort preferences are stored in the URL. This allows you to combine sorting a filters in a powerful way. Note that all parameters need to be url encoded.

- Show me all tasks due today or overdue, sorted from the highest priority down: `https://flowist.joschua.io/secure/?filter=today%7Coverdue&sort=prio:desc` (`%7` is the encoding for `|` which stands for "or" in Todoist Filters)
- Display tasks in Inbox, with the most overdue items first: `https://flowist.joschua.io/secure/?filter=Inbox&sort=due:desc`
- Show me tasks tagged "phone", sorted by priority and then by project: `https://flowist.joschua.io/secure/?filter=%40phone&sort=prio:asc,proj:desc`

This URL scheme allows for some impactful automations. In your note for a project, put a Flowist link. Whenever you're working on it, jump straight into Focus Mode.

## Help

If you encounter any bugs, feel free to mention them in this project's [issues](https://github.com/selfire1/todoist-focus-mode/issues). In case you're stuck and need some help, please open an issue as well.

The issues are also the place for feature requests. Since Flowist is an opinionated tool designed to be simple, some features may not be compatible.

🐦 Stay up to date with development on [Twitter](https://twitter.com/selfire1)
