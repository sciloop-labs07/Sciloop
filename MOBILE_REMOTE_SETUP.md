# SciLoop Mobile Remote Setup

Use these two files on phones:

- [ForLoop Control Panel Mobile.html](</C:/Users/moham/Downloads/Sciloop%203/ForLoop%20Control%20Panel%20Mobile.html>)
- [SciLoop Mobile Remote.html](</C:/Users/moham/Downloads/Sciloop%203/SciLoop%20Mobile%20Remote.html>)

They are for a remote server setup, not `localhost` on the phone.

## Query Parameters

You can open both files with the same server query:

```text
?server=https://your-server.com
```

Or set the URLs separately:

```text
?forloop=https://your-server.com&api=https://your-server.com&lab=https://your-server.com/visual-language-lab
```

## Example

```text
file:///.../ForLoop%20Control%20Panel%20Mobile.html?server=https://your-server.com
file:///.../SciLoop%20Mobile%20Remote.html?server=https://your-server.com
```

## Notes

- `forloop` is the ForLoop backend URL, usually port `3001` or your reverse-proxied admin URL.
- `api` is the SciLoop AI backend URL, usually port `5050` or your reverse-proxied API URL.
- `lab` is the Visual Language Lab URL if you expose it separately.
- If no remote URL is given, phone features that depend on backend services will stay offline.
