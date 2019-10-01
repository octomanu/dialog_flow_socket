import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/sockets';

export const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {

    res.json({
        ok: true,
        mensaje: 'Todo ok',
    });

});


router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        cuerpo,
        de
    }
    const server = Server.getInstance();
    server.io.emit('mensaje-nuevo', payload);


    res.json({
        ok: true,
        mensaje: 'Todo ok',
    });


});

router.post('/mensajes/:id', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }


    const server = Server.getInstance();
    //envio mensaje privado.
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        mensaje: 'POST ok',
        cuerpo,
        de,
        id
    });

});




//id usuarios

router.get('/usuarios', (req: Request, res: Response) => {

    const server = Server.getInstance();

    server.io.clients((err: any, clientes: string[]) => {

        if(err){
            return res.json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            clientes
        });

    });

});

//obtener usuarios y nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {


        res.json({
            ok: true,
            clientes: usuariosConectados.getLista()
        });


});



export default router;